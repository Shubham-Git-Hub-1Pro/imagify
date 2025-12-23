// ===============================
// server.js (FINAL FIXED VERSION)
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// ✅ Clean ENV logs (NO HF_MODEL ANYWHERE)
console.log("ENV Loaded ✔️");
console.log("HF API Key Present?:", !!process.env.HF_API_KEY);

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully ✔️");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
