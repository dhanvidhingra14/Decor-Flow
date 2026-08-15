const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");
const router = express.Router();
const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
const isValidEmail = (email) => !email || /^\S+@\S+\.\S+$/.test(email);
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email || "", phone: user.phone || "", role: user.role });
const createToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "decorflow_super_secret_2026", { expiresIn: "1d" });
const sendLogin = (res, user, message = "Login successful") => res.status(200).json({ message, token: createToken(user), user: publicUser(user) });

router.post("/login", async (req, res) => {
  try { const { email, password, role } = req.body; if (!email || !password) return res.status(400).json({ message: "Email and password are required" }); const user = await User.findOne({ email: email.toLowerCase().trim() }); if (!user || !await bcrypt.compare(password, user.password || "")) return res.status(401).json({ message: "Invalid email or password" }); if (role && user.role !== role) return res.status(403).json({ message: `This account is registered as ${user.role}.` }); return sendLogin(res, user); }
  catch (error) { console.error("LOGIN ERROR:", error); return res.status(500).json({ message: "Login failed" }); }
});
router.post("/client/register", async (req, res) => {
  try { const name = String(req.body.name || "").trim(); const phone = normalizePhone(req.body.phone); const email = String(req.body.email || "").trim().toLowerCase(); if (!name || !isValidPhone(phone)) return res.status(400).json({ message: "Enter your name and a valid 10-digit mobile number." }); if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address or leave it blank." }); if (await User.exists({ phone })) return res.status(409).json({ message: "An account with this mobile number already exists. Please sign in." }); if (email && await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." }); const user = await User.create({ name, phone, email: email || undefined, role: "client" }); await Customer.findOneAndUpdate({ phone }, { name, phone, email, address: "" }, { new: true, upsert: true, setDefaultsOnInsert: true }); return sendLogin(res, user, "Account created successfully"); }
  catch (error) { console.error("CLIENT REGISTER ERROR:", error); return res.status(500).json({ message: "Could not create your account. Please try again." }); }
});
router.post("/client/login", async (req, res) => {
  try { const phone = normalizePhone(req.body.phone); if (!isValidPhone(phone)) return res.status(400).json({ message: "Enter a valid 10-digit mobile number." }); const user = await User.findOne({ phone, role: "client" }); if (!user) return res.status(404).json({ message: "No account was found for this mobile number. Create an account first." }); return sendLogin(res, user); }
  catch (error) { console.error("CLIENT LOGIN ERROR:", error); return res.status(500).json({ message: "Could not sign in. Please try again." }); }
});
module.exports = router;
