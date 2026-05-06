const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/quiz", async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Create a short quiz about ${topic}. Give 5 multiple choice questions with answers.`
              }
            ]
          }
        ]
      }
    );

    const text =
      response.data.candidates[0].content.parts[0].text;

    res.json({ quiz: text });

  } catch (err) {
  console.error("FULL ERROR:", err.response?.data || err.message);
  res.status(500).json({ error: err.response?.data || err.message });
}
});

module.exports = router;