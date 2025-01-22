import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import "./ProductDetails.css";

const ProductDetails = ({ token }) => {
  const { id } = useParams(); // Extract product ID from the route
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleBuyNow = () => {
    alert(`Purchased ${quantity} ${product.name}!`);
  };

  return (
    <div className="product-details-page">
      {product ? (
        <Card className="product-details-card">
          <CardMedia
            component="img"
            alt={product.name}
            image={product.imageUrl || "/default-product-image.jpg"}
            className="product-image"
          />
          <CardContent>
            <Typography variant="h4">{product.name}</Typography>
            <Typography variant="h5" color="primary">
              ₹ {product.price}
            </Typography>
            <Typography variant="body1">{product.description}</Typography>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1 }}
              className="quantity-input"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleBuyNow}
              className="buy-now-button"
            >
              Buy Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">Loading product details...</Typography>
      )}
    </div>
  );
};

export default ProductDetails;
