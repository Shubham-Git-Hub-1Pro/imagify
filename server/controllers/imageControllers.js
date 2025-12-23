import axios from "axios";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?.id;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.status(403).json({ success: false, message: "No credit balance" });
    }

    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ success: false, message: "HF_API_KEY missing" });
    }

    // ✅ ONLY FREE + WORKING MODEL
    const MODEL = "black-forest-labs/FLUX.1-schnell";
    const HF_URL = `https://router.huggingface.co/hf-inference/models/${MODEL}`;

    console.log("🟡 Prompt:", prompt);
    console.log("🧠 HF Model:", MODEL);

    const hfResponse = await axios.post(
      HF_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          Accept: "image/png",
        },
        responseType: "arraybuffer",
        timeout: 120000,
        validateStatus: () => true,
      }
    );

    const contentType = hfResponse.headers["content-type"];

    // ❌ JSON error → show readable message
    if (!contentType || !contentType.includes("image")) {
      const errorText = Buffer.from(hfResponse.data).toString();
      console.error("❌ HF ERROR:", errorText);
      return res.status(502).json({
        success: false,
        message: "HuggingFace error",
        error: errorText,
      });
    }

    // ✅ IMAGE RECEIVED
    const base64Image = Buffer.from(hfResponse.data).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    user.creditBalance -= 1;
    await user.save();

    const saved = await imageModel.create({
      userId: user._id,
      prompt,
      imageUrl,
    });

    console.log("✅ Image generated successfully");

    return res.json({
      success: true,
      imageUrl,
      creditBalance: user.creditBalance,
      generationId: saved._id,
    });
  } catch (error) {
    console.error("🔥 Server Crash:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserGenerations = async (req, res) => {
  const userId = req.user?.id;
  const totalGenerations = await imageModel.countDocuments({ userId });
  const recentGenerations = await imageModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({ success: true, totalGenerations, recentGenerations });
};

export const getGeneration = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ success: false, message: "Invalid ID" });
  }

  const generation = await imageModel.findOne({ _id: id, userId });
  if (!generation) {
    return res.json({ success: false, message: "Not found" });
  }

  res.json({ success: true, generation });
};

export default {
  generateImage,
  getUserGenerations,
  getGeneration,
};
