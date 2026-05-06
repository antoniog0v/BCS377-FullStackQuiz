const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../db/supabase");

const router = express.Router();

/**
 * SIGNUP!!!!
 */
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from("users").insert([
      {
        username,
        email,
        password_hash: passwordHash,
      },
    ]);

    if (error) return res.status(400).json(error);

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * LOGIN!!!!!
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      data.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: data.id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: data.id, email: data.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;