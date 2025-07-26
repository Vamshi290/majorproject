const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  agree: { type: Boolean, required: true },
  idCardPhoto: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
