import React, { useState } from "react";
import axios from "axios";

function StudentSignup() {
  const [form, setForm] = useState({
    name: "",
    year: "",
    branch: "",
    rollNo: "",
    contact: "",
    email: "",
    password: "",
    agree: false,
  });
  const [idCard, setIdCard] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setIdCard(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) {
      setMessage("You must agree to the terms.");
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (idCard) data.append("idCardPhoto", idCard);

    try {
      const res = await axios.post("http://localhost:3001/student/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Registration successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded w-25">
        <h2 className="text-center mb-4">Student Sign Up</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Year</label>
            <select
              className="form-control"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
          </div>
          <div className="mb-2">
            <label>Branch</label>
            <input
              type="text"
              className="form-control"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Roll No.</label>
            <input
              type="text"
              className="form-control"
              name="rollNo"
              value={form.rollNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Contact Number</label>
            <input
              type="tel"
              className="form-control"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
            />
          </div>
          <div className="mb-2">
            <label>College Email ID</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>ID Card Photo (jpg only)</label>
            <input
              type="file"
              className="form-control"
              accept=".jpg"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              id="agree"
              required
            />
            <label className="form-check-label" htmlFor="agree">
              I agree to the terms and conditions
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
}

export default StudentSignup;
