const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Use CORS properly
app.use(cors({
  origin: "http://localhost:8080", // Replace with 5173 if using Vite
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.send("✅ Server is running");
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
