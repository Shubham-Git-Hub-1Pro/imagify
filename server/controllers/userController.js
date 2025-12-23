// server/controllers/userController.js
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const getDevStack = (err) => {
  return (process.env.NODE_ENV === 'development') ? err.stack : undefined;
};

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    email = email.toLowerCase().trim();

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      creditBalance: 5 // 🎁 FREE credits on signup
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, stack: getDevStack(error) });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();
    const user = await userModel.findOne({ email });

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= USER CREDITS ================= */
const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { id: user._id, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= BUY CREDITS (NEW 🔥) ================= */
const buyCredits = async (req, res) => {
  try {
    const { plan } = req.body; // basic | advanced | business
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let creditsToAdd = 0;

    if (plan === "basic") creditsToAdd = 5;
    else if (plan === "advanced") creditsToAdd = 15;
    else if (plan === "business") creditsToAdd = 50;
    else {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    user.creditBalance += creditsToAdd;
    await user.save();

    res.json({
      success: true,
      message: `Credits added successfully (${creditsToAdd})`,
      credits: user.creditBalance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, userCredits, buyCredits };
