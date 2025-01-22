import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import "./Products.css";

const Products = ({ isAdmin, token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOption, setSortOption] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://dev-project-ecommerce.upgrad.dev/api/products", {
        headers: { "x-auth-token": token },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://dev-project-ecommerce.upgrad.dev/api/products/categories", {
        headers: { "x-auth-token": token },
      });
      setCategories(["ALL", ...response.data]);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`https://dev-project-ecommerce.upgrad.dev/api/products/${productId}`, {
        headers: { "x-auth-token": token },
      });
      setSnackbarMessage("Product deleted successfully");
      setSnackbarOpen(true);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct.id) {
        // Edit product
        await axios.put(
          `https://dev-project-ecommerce.upgrad.dev/api/products/${editingProduct.id}`,
          editingProduct,
          { headers: { "x-auth-token": token } }
        );
        setSnackbarMessage("Product modified successfully");
      } else {
        // Add new product
        await axios.post("https://dev-project-ecommerce.upgrad.dev/api/products", editingProduct, {
          headers: { "x-auth-token": token },
        });
        setSnackbarMessage("Product added successfully");
      }
      setSnackbarOpen(true);
      fetchProducts();
      handleDialogClose();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "ALL" || product.category === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "PRICE_HIGH_TO_LOW") return b.price - a.price;
      if (sortOption === "PRICE_LOW_TO_HIGH") return a.price - b.price;
      if (sortOption === "NEWEST") return new Date(b.addedDate) - new Date(a.addedDate);
      return 0;
    });

  return (
    <div className="products-page">
      <div className="controls">
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          className="category-toggle"
        >
          {categories.map((category) => (
            <ToggleButton key={category} value={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Select value={sortOption} onChange={handleSortChange} className="sort-dropdown">
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="PRICE_HIGH_TO_LOW">Price: High to Low</MenuItem>
          <MenuItem value="PRICE_LOW_TO_HIGH">Price: Low to High</MenuItem>
          <MenuItem value="NEWEST">Newest</MenuItem>
        </Select>
        {isAdmin && (
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
            Add Product
          </Button>
        )}
      </div>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="product-card">
            <CardMedia
              component="img"
              height="140"
              image={product.imageUrl}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                ₹ {product.price}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              <Button variant="contained" color="primary">
                Buy
              </Button>
              {isAdmin && (
                <>
                  <Button variant="outlined" color="primary" onClick={() => handleEditClick(product)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteClick(product.id)}>
                    Delete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editingProduct?.id ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={editingProduct?.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="category"
            label="Category"
            value={editingProduct?.category || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="price"
            label="Price"
            value={editingProduct?.price || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={editingProduct?.description || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="imageUrl"
            label="Image URL"
            value={editingProduct?.imageUrl || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Products;
