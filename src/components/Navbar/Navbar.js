import React from "react";
import { AppBar, Toolbar, Typography, Button, InputBase } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar className="navbar">
        <ShoppingCartIcon className="logo-icon" />
        <Typography variant="h6" className="title">
          upGrad Eshop
        </Typography>
        {!isLoggedIn ? (
          <>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/signup")}>Signup</Button>
          </>
        ) : (
          <>
            <InputBase className="search-bar" placeholder="Search..." />
            <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
            {isAdmin && <Button color="inherit" onClick={() => navigate("/add-product")}>Add Product</Button>}
            <Button color="secondary" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;