import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import profileModel from "../models/profile.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const profile = await profileModel.create({ userId: newUser._id });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "something went wrong" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = crypto.randomBytes(32).toString("hex");

    const isfind = await User.updateOne({ _id: user._id }, { token: token });
    return res.json({ message: "User logged in successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({ message: "Profile picture updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
