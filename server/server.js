// ===============================
// server.js (FINAL PRODUCTION READY)
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

// ===============================
// Load Environment Variables
// ===============================
dotenv.config();

// Safe debug (Render logs)
console.log("ENV Loaded ✔️");
console.log("HF API Key Present?:", !!process.env.HF_API_KEY);

// ===============================
// App Init
// ===============================
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// 🔥 CORS — FINAL FIX (NO MORE NETWORK ERROR)
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // local dev
      "https://imagify-rouge-zeta.vercel.app",  // vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// ===============================
// Middlewares
// ===============================
app.use(express.json());

// ===============================
// Health / Root Route
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Imagify Backend is running 🚀",
  });
});

// Optional (extra check)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ===============================
// API Routes
// ===============================
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

// ===============================
// Start Server
// ===============================
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully ✔️");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
