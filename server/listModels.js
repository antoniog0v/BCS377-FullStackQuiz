require("dotenv").config();
const axios = require("axios");

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

listModels();