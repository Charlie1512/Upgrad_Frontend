import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Products from "./components/Products/Products";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import PrivateRoute from "./components/PrivateRoute";
import CreateOrder from "./components/CreateOrder/CreateOrder";

const App = () => {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={!!token} isAdmin={isAdmin} handleLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/products"
          element={
            <PrivateRoute isAuthenticated={!!token}>
              <Products isAdmin={isAdmin} token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute isAuthenticated={!!token}>
              <ProductDetails token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-order"
          element={
            <PrivateRoute isAuthenticated={!!token}>
              <CreateOrder token={token} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
