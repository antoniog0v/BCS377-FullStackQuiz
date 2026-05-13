const express = require("express");
const jwt = require("jsonwebtoken");
const supabase = require("../db/supabase");

const router = express.Router();

/**
 * ADD POINTS
 */

router.post("/add-points", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const score = Number(req.body.score);

    if (isNaN(score) || score < 0) {
      return res.status(400).json({ message: "Invalid score value" });
    }

    // Get current points
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("total_points")
      .eq("id", decoded.id)
      .single();

    if (fetchError || !userData) {
      return res.status(400).json({ message: "User not found", detail: fetchError });
    }

    const currentPoints = Number(userData.total_points) || 0;
    const newTotal = currentPoints + score;

    console.log("CURRENT:", currentPoints);
    console.log("ADDING:", score);
    console.log("NEW:", newTotal);

    // Update and return the confirmed DB value
    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ total_points: newTotal })
      .eq("id", decoded.id)
      .select("total_points")
      .single();

    if (updateError) {
      return res.status(400).json({ message: "Update failed", detail: updateError });
    }

    res.json({
      message: "Points updated",
      total_points: updateData.total_points,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET LEADERBOARD
 */

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("username, email, total_points")
      .order("total_points", { ascending: false });

    if (error) {
      return res.status(400).json(error);
    }

    const ranked = data.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      email: user.email,
      total_points: user.total_points ?? 0,
    }));

    res.json(ranked);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;