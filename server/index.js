const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

// backend api route test
app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from backend 🚀",
    time: new Date().toISOString()
  });
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});