import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post("https://dev-project-ecommerce.upgrad.dev/api/auth/signup", userDetails);
      alert("Signup successful!");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input name="firstName" placeholder="First Name" onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />
      <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
