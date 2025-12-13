import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import "./auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("ADMIN");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = { email, password };
      const res = await ApiService.loginUser(loginData);

      if (role !== res.role) {
        setMessage(`Access Denied: Please login using ${res.role} mode`);
        return;
      }

      ApiService.saveToken(res.token);
      ApiService.saveRole(res.role);
      setMessage("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      {/* FIXED BACKGROUND LAYER */}
      <div className="fixed-bg"></div>
      <div className="auth-box">
        <h2>Inventory Management System</h2>

        <div className="role-switch">
          <button
            className={role === "ADMIN" ? "active" : ""}
            onClick={() => setRole("ADMIN")}
          >
            Admin Login
          </button>
          <button
            className={role === "MANAGER" ? "active" : ""}
            onClick={() => setRole("MANAGER")}
          >
            Manager Login
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={`${role} Email`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={`${role} Password`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login as {role}
          </button>
        </form>

        {role === "MANAGER" && (
          <p className="register-text">
            Don't have an account? <a href="/register">Register</a>
          </p>
        )}
      </div>
    </>
  );
};

export default LoginPage;
