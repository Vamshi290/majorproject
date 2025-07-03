const express = require('express');
const router = express.Router();
const LostFoundItemsModel = require('./models/LostFoundItems');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Handle lost/found item submission
router.post('/lostfound', upload.single('image'), (req, res) => {
  const { name, category, description, location, itemType } = req.body;
  const image = req.file?.path;
  const date = new Date();

  const newItem = new LostFoundItemsModel({
    name,
    category,
    description,
    location,
    itemType,
    image,
    date,
  });

  newItem
    .save()
    .then((item) => res.status(201).json(item))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
