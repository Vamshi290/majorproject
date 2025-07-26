const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');

const Student = require('./models/Student');
const Admin = require('./models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';
const otpStore = {};

// ✅ Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Employee routes removed - using Admin and Student models instead

// Password reset routes removed - can be added back if needed for Admin/Student

// ✅ Student Registration with Image Upload
router.post("/student/register", upload.single("idCardPhoto"), async (req, res) => {
  try {
    const { name, year, branch, rollNo, contact, email, password, agree } = req.body;

    if (!req.file) return res.status(400).json({ message: "ID card photo is required." });
    if (!rollNo || rollNo.trim() === "") return res.status(400).json({ message: "Roll number is required." });

    const existing = await Student.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: "Roll number already registered." });

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
    res.status(201).json({ message: "Student registered successfully." });

  } catch (err) {
    console.error("🚨 Error in /student/register:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ Student Login
router.post('/login/student', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'No student record found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Student login successful', userType: 'student', userId: student._id });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Admin Registration
router.post('/signup/admin', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const studentExists = await Student.findOne({ email });
    const adminExists = await Admin.findOne({ username: email });

    if (adminExists || studentExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });

  } catch (err) {
    console.error("🚨 Admin registration error:", err); // print full error stack
    res.status(500).json({ message: 'Admin registration error', error: err.message });
  }
});


// ✅ Admin Login
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({
      message: 'Admin login successful',
      userType: 'admin',
      userId: admin._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Student Signup (just email & password)
router.post('/signup/student', async (req, res) => {
  const { email, password } = req.body;
  try {
    const studentExists = await Student.findOne({ email });
    const adminExists = await Admin.findOne({ username: email });

    if (studentExists || adminExists) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ email, password: hashedPassword });
    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Student registration error' });
  }
});

// Optional Middleware for Role-Based Access
function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
  };
}

module.exports = router;
