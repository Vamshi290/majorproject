require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const Admin = require('./models/Admin');

const LostFoundItemsModel = require("./models/LostFoundItems");
const LostItemModel = require("./models/LostItem");
const FoundItemModel = require("./models/FoundItem");
const LostFound = require("./LostFound");
const authRoutes = require("./authRoutes");
const nodemailer = require('nodemailer');
const Student = require('./models/Student');
const app = express();

// Middleware
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// CORS setup
app.use(cors({
  origin: ['http://localhost:5173','https://majorproject1-pi.vercel.app'],

  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON parsing
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only image files (jpg, jpeg, png) are allowed"));
  },
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));
// MongoDB connection
mongoose.connect(process.env.MONGO_URI || " ")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Admin role authorization middleware using session
const verifyAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') next();
  else res.status(403).json({ message: 'Forbidden' });
};

const verifySession = (req, res, next) => {
  if (req.session.user) next();
  else res.status(403).json({ message: 'Access denied' });
};

// Authentication routes are handled by authRoutes.js
app.post("/student/register", upload.single("idCardPhoto"), async (req, res) => {
  try {
    const { name, year, branch, rollNo, contact, email, agree, password } = req.body;
    const idCardPhoto = req.file ? req.file.path : null;

    if (!name || !year || !branch || !rollNo || !contact || !email || !password || !agree || !idCardPhoto) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingStudent = await Student.findOne({ rollNo: rollNo.trim() });
    if (existingStudent) return res.status(400).json({ message: "Roll number already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name: name.trim(),
      year,
      branch: branch.trim(),
      rollNo: rollNo.trim(),
      contact: contact.trim(),
      email: email.trim(),
      password: hashedPassword,
      idCardPhoto,
      agree: agree === "true" || agree === true,
    });
    await student.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin routes are handled by authRoutes.js


// Use LostFound and authRoutes middleware
app.use(LostFound);
app.use(authRoutes);

// Route to handle POST requests for lost and found items with image upload
// Route for submitting a lost/found item
app.post("/lostfound", verifySession, upload.single("image"), (req, res) => {
  const { name, category, description, location, itemType,postedOn } = req.body;
  const image = req.file ? req.file.path : null;

  if (!name || !category || !description || !location || !itemType) {
      return res.status(400).json({ message: "All fields are required." });
  }

  //const date = new Date();
  const date = postedOn ? new Date(postedOn) : new Date(); // Allow user to provide a custom date, else use the current date


  LostFoundItemsModel.create({
      name,
      category,
      description,
      location,
      date,
      itemType,
      image,
  })
      .then((lostFoundItem) => res.json(lostFoundItem))
      .catch((err) => res.status(500).json({ error: err.message }));
});

// Route for updating item status (approve/reject)
app.patch('/lostfound/update/:id', async (req, res) => {
  try {
      const { status } = req.body; // e.g., "approved" or "rejected"
      const updatedItem = await LostFoundItemsModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!updatedItem) {
          return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(updatedItem);
  } catch (error) {
      res.status(500).json({ message: "Error updating item status", error });
  }
});


// Route to fetch all pending items
app.get('/lostfound/pending', async (req, res) => {
  const items = await LostFoundItemsModel.find({ status: 'pending' });
  res.json(items);
});


// Route to fetch all approved lost items
app.get("/lostfound/lost", async (req, res) => {
  try {
      const lostItems = await LostFoundItemsModel.find({ status: "approved", itemType: "lost" });
      res.status(200).json(lostItems);
  } catch (error) {
      res.status(500).json({ message: "Error fetching lost items", error });
  }
});


// Route to fetch all approved found items
app.get("/lostfound/found", async (req, res) => {
  try {
      const foundItems = await LostFoundItemsModel.find({ status: "approved", itemType: "found" });
      res.status(200).json(foundItems);
  } catch (error) {
      res.status(500).json({ message: "Error fetching found items", error });
  }
});

// Route for lost and found item submission (new endpoint)
app.post('/lostitems', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, contactNumber, description, location } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    if (!name || !contactNumber || !description || !location) {
      return res.status(400).json({ message: 'Name, description, location, and contact number are required.' });
    }

    const lostItem = new LostItemModel({
      name,
      contactNumber,
      description,
      location,
      imageUrl,
      status: 'pending', // Default status
    });

    await lostItem.save();
    res.status(201).json({ message: 'Lost item saved successfully', lostItem });
  } catch (error) {
    console.error('Error saving lost item:', error);
    res.status(500).json({ message: 'Error saving lost item' });
  }
});

// Approve/Reject Lost Item
app.patch('/lostitems/update/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedItem = await LostItemModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Error updating item status" });
  }
});

// Get Pending Lost Items
app.get('/lostitems/pending', async (req, res) => {
  try {
    const pendingItems = await LostItemModel.find({ status: 'pending' });
    res.json(pendingItems);
  } catch (error) {
    console.error("Error fetching pending lost items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Lost Items (Approved, Rejected, Pending)
app.get('/lostitems', async (req, res) => {
  try {
    const lostItems = await LostItemModel.find();
    res.json(lostItems);
  } catch (error) {
    console.error("Error fetching lost items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ============ FOUND ITEMS ROUTES ============ */

// Create Found Item
app.post('/founditems', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, contactNumber, description, location } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    if (!name || !contactNumber || !description || !location) {
      return res.status(400).json({ message: 'Name, description, location, and contact number are required.' });
    }

    const foundItem = new FoundItemModel({
      name,
      contactNumber,
      description,
      location,
      imageUrl,
      status: 'pending', // Default status
    });

    await foundItem.save();
    res.status(201).json({ message: 'Found item saved successfully', foundItem });
  } catch (error) {
    console.error('Error saving found item:', error);
    res.status(500).json({ message: 'Error saving found item' });
  }
});

// Approve/Reject Found Item
app.patch('/founditems/update/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedItem = await FoundItemModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Error updating item status" });
  }
});

// Get Pending Found Items
app.get('/founditems/pending', async (req, res) => {
  try {
    const pendingItems = await FoundItemModel.find({ status: 'pending' });
    res.json(pendingItems);
  } catch (error) {
    console.error("Error fetching pending found items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Found Items (Approved, Rejected, Pending)
app.get('/founditems', async (req, res) => {
  try {
    const foundItems = await FoundItemModel.find();
    res.json(foundItems);
  } catch (error) {
    console.error("Error fetching found items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to fetch items submitted by a specific user
app.get('/lostfound/myitems', async (req, res) => {
  // For demo: get userId from query param or localStorage (not secure, but no middleware)
  const userId = req.query.userId; // or pass userId in the request
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  try {
    const items = await LostFoundItemsModel.find({ submittedBy: userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your items" });
  }
});

// Route to fetch all approved items
app.get('/lostfound/approved', async (req, res) => {
  const items = await LostFoundItemsModel.find({ status: 'approved' });
  res.json(items);
});

// Route to fetch rejected items
app.get('/lostfound/rejected', async (req, res) => {
  try {
    const items = await LostFoundItemsModel.find({ status: "rejected" });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rejected items" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


