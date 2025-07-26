import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      return setError("All fields are required.");
    }

    try {
      const res = await axios.post("http://localhost:3001/signup/admin", {
        name,
        email,
        password,
      });

      if (res.data.message === "Admin registered successfully") {
        navigate("/admin/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded w-25">
        <h2 className="text-center mb-4">Admin Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name"><strong>Name</strong></label>
            <input
              type="text"
              placeholder="Enter Admin Name"
              autoComplete="off"
              className="form-control rounded-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Admin Email"
              autoComplete="off"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>

        <p className="text-center mt-3">Already have an account?</p>
        <Link to="/admin/login" className="btn btn-primary w-100 rounded-0">Login</Link>
      </div>
    </div>
  );
}

export default AdminSignUp;