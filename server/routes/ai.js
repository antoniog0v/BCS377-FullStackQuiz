const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// GROQ 
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * QUIZ GENERATOR (GROQ)
 */
router.post("/quiz", async (req, res) => {
  const { topic } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Create a short quiz about ${topic}. Give 5 multiple choice questions with answers.`
        }
      ]
    });

    const text = completion.choices[0].message.content;

    res.json({ quiz: text });

  } catch (err) {
    console.error("Groq error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

module.exports = router;