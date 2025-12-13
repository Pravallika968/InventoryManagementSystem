import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerAuth.css";

const CustomerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    if (isLogin) {
      // LOGIN FLOW
      const existingCustomer = customers.find((c) => c.email === email);
      if (existingCustomer) {
        if (existingCustomer.password === password) {
          localStorage.setItem("loggedInCustomer", JSON.stringify(existingCustomer));
          setMessage("Login Successful!");
          navigate("/customer/order");
        } else {
          setMessage("Incorrect password");
        }
      } else {
        setMessage("Email does not exist. Please Sign Up first.");
      }
    } else {
      // SIGN UP FLOW
      if (!name || !password) {
        setMessage("Please enter all fields to register.");
        return;
      }
      const existingCustomer = customers.find((c) => c.email === email);
      if (existingCustomer) {
        setMessage("Email already exists. Please login.");
        return;
      }
      const newCustomer = { name, email, password };
      customers.push(newCustomer);
      localStorage.setItem("customers", JSON.stringify(customers));
      localStorage.setItem("loggedInCustomer", JSON.stringify(newCustomer));
      setMessage("Registration Successful!");
      navigate("/customer/order");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="welcome-msg">Welcome Customer!</h2>
        <p className="auth-intro">
          {isLogin
            ? "Login to continue shopping"
            : "Sign up to create your account"}
        </p>

        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
};

export default CustomerAuth;
