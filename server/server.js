// ===============================
// server.js (FINAL PRODUCTION FIX)
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

// Load env
dotenv.config();

// Debug logs (safe)
console.log("ENV Loaded ✔️");
console.log("HF API Key Present?:", !!process.env.HF_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// 🔥 CORS FIX (MOST IMPORTANT)
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local dev
      "https://imagify-rouge-zeta.vercel.app" // production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);

// ===============================
// Middlewares
// ===============================
app.use(express.json());

// ===============================
// Root test route (avoid Not Found)
// ===============================
app.get("/", (req, res) => {
  res.send("Imagify Backend is running 🚀");
});

// ===============================
// Routes
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
