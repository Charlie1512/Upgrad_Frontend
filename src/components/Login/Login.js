import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/auth/signin",
        { username: email, password }
      );
      setToken(response.headers["x-auth-token"]);
      navigate("/");
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
};

export default Login;