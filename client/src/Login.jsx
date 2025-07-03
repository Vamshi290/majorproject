import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Reuse your signup styles

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Determine role from URL (e.g., /admin/login or /student/login)
    const isAdmin = location.pathname.includes("/admin");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // You may want to send role as well, depending on your backend
            const res = await axios.post("http://127.0.0.1:3001/login", {
                email,
                password,
                role: isAdmin ? "admin" : "student",
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", isAdmin ? "admin" : "student");
            setMessage("Login successful!");
            // Redirect based on role
            if (isAdmin) {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-25">
                <h2 className="text-center mb-4">{isAdmin ? "Admin Login" : "Student Login"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-control rounded-0"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-control rounded-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-end">
                        <Link to="/forgot-password" className="text-primary" style={{ textDecoration: "none" }}>
                            Forgot Password?
                        </Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-0">
                        Login
                    </button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
}

export default Login;
