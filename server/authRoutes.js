const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EmployeeModel = require('./models/Employee');
const User = require('./models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';
const otpStore = {};
const nodemailer = require('nodemailer');
const Student = require('./models/Student');
const multer = require('multer');
const Employee = require('./models/Employee');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email, role }); // Check both email and role
    if (!user) return res.status(404).json({ message: "No record found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // Issue JWT with role (optional, for future)
    const token = "dummy-token"; // or use JWT if you want
    res.json({ message: "Success", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  console.log("Registering:", req.body);
  const { email, password, name, role } = req.body;

  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    bcrypt.hash(password, 3, async (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err });
      }

      const newEmployee = new EmployeeModel({ email, password: hashedPassword, name, role });
      await newEmployee.save();
      res.status(201).json(newEmployee);
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

// Forgot Password - Send Reset Link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a reset token valid for 15 minutes
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Construct reset link
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send email using Outlook/Hotmail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error("Error sending reset link:", err);
    res.status(500).json({ message: 'Error sending reset link' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: 'OTP not requested' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });
  if (otp !== record.otp) return res.status(400).json({ message: 'Invalid OTP' });

  // Issue temporary token after successful OTP verification
  const user = await EmployeeModel.findOne({ email });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '10m' });

  // Invalidate OTP
  delete otpStore[email];

  res.json({ message: 'OTP verified successfully', token });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await EmployeeModel.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Student registration route
router.post("/student/register", upload.single("idCardPhoto"), async (req, res) => {
  try {
    const { name, year, branch, rollNo, contact, email, password, agree } = req.body;
    if (!req.file) return res.status(400).json({ message: "ID card photo required" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      year,
      branch,
      rollNo,
      contact,
      email,
      password: hashedPassword,
      agree,
      idCardPhoto: req.file.filename,
    });
    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student login route
router.post("/student/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Only look for students!
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // ...generate token or session...
    res.json({ message: "Login successful", student });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin login route
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Only look for admins!
    const admin = await Employee.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // ...generate token or session...
    res.json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

function requireRole(role) {
  return (req, res, next) => {
    // Assuming you set req.user in your auth middleware
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
  };
}

module.exports = router;
