import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "", type: "" });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ message: "Please fill in all fields.", type: "error" });
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus({ message: "Please enter a valid email address.", type: "error" });
      setIsSubmitting(false);
      return;
    }

    const object = {
      ...formData,
      access_key: "8ad8d212-de43-4ef7-8b78-a48e6ae0d455", // Replace with your actual API access key
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(object),
      });

      const res = await response.json();

      // Debugging: log the full response
      console.log("API response:", res);

      if (res.success) {
        setStatus({ message: "Thank you for your message!", type: "success" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ message: "Something went wrong. Please try again.", type: "error" });
      }
    } catch (error) {
      // Log the error for debugging
      console.error("Error during form submission:", error);
      setStatus({ message: "Error occurred. Please try again later.", type: "error" });
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #87CEEB, #6A5ACD)", // Bright Blue to Purple Gradient
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        background: "#FFFFFF", // White Form Background
        textAlign: "center"
      }}>
        <h1 style={{ color: "#1E3A8A", fontSize: "28px", marginBottom: "15px", fontWeight: "bold" }}>Contact Us</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", color: "#1E3A8A", fontWeight: "bold", display: "block", textAlign: "left" }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #4169E1",
                borderRadius: "6px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#E0FFFF", // Light Cyan Input Field
                color: "#333"
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", color: "#1E3A8A", fontWeight: "bold", display: "block", textAlign: "left" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #4169E1",
                borderRadius: "6px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#E0FFFF", // Light Cyan Input Field
                color: "#333"
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", color: "#1E3A8A", fontWeight: "bold", display: "block", textAlign: "left" }}>
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #4169E1",
                borderRadius: "6px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#E0FFFF", // Light Cyan Input Field
                color: "#333",
                resize: "vertical",
                height: "150px"
              }}
            ></textarea>
          </div>
          {status.message && (
            <p style={{
              fontSize: "14px",
              marginTop: "10px",
              color: status.type === "success" ? "green" : "red"
            }}>
              {status.message}
            </p>
          )}
          <button type="submit" disabled={isSubmitting} style={{
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            backgroundColor: "#4169E1", // Royal Blue Submit Button
            color: "#ffffff",
            fontWeight: "bold",
            transition: "0.3s",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
