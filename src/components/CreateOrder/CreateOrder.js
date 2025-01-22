import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import axios from "axios";
import "./CreateOrder.css";

const CreateOrder = ({ token }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    name: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    zipCode: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const steps = ["Items", "Select Address", "Confirm Order"];

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("https://dev-project-ecommerce.upgrad.dev/api/addresses", {
        headers: { "x-auth-token": token },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        newAddress,
        {
          headers: { "x-auth-token": token },
        }
      );
      setAddresses([...addresses, response.data]);
      setNewAddress({
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zipCode: "",
      });
    } catch (error) {
      console.error("Error adding address", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select an address!");
      return;
    }
    try {
      await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/orders",
        { address: selectedAddress },
        {
          headers: { "x-auth-token": token },
        }
      );
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      setError("Please select an address!");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError("");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="create-order-page">
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="step-content">
        {activeStep === 0 && (
          <Typography>Review your selected product details here.</Typography>
        )}
        {activeStep === 1 && (
          <div>
            <FormControl fullWidth>
              <Select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Address
                </MenuItem>
                {addresses.map((address) => (
                  <MenuItem key={address.id} value={address.id}>
                    {`${address.name}, ${address.street}, ${address.city}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h6">OR</Typography>
            <div className="new-address-form">
              <TextField
                label="Name"
                fullWidth
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              />
              <TextField
                label="Contact Number"
                fullWidth
                value={newAddress.contactNumber}
                onChange={(e) => setNewAddress({ ...newAddress, contactNumber: e.target.value })}
              />
              <TextField
                label="Street"
                fullWidth
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              />
              <TextField
                label="City"
                fullWidth
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <TextField
                label="State"
                fullWidth
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
              <TextField
                label="Landmark"
                fullWidth
                value={newAddress.landmark}
                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
              />
              <TextField
                label="Zip Code"
                fullWidth
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              />
              <Button variant="contained" onClick={handleAddAddress}>
                Save Address
              </Button>
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <Typography>Your order details are ready to be confirmed!</Typography>
        )}
      </div>
      <div className="step-actions">
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
            Confirm Order
          </Button>
        )}
      </div>
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default CreateOrder;
