import React, { useState } from "react";
import "./AddProduct.css"; // Import CSS file

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockUnit, setStockUnit] = useState("");
  const [displayQuantity, setDisplayQuantity] = useState("");
  const [displayUnit, setDisplayUnit] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const unitOptions = ["KG", "G", "ML", "L", "PACKET", "BOTTLE", "CAN", "OTHER"];

  // Clear one field
  const handleClear = (field) => {
    switch (field) {
      case "productName":
        setProductName("");
        break;
      case "category":
        setCategory("");
        break;
      case "price":
        setPrice("");
        break;
      case "stockQuantity":
        setStockQuantity("");
        break;
      case "stockUnit":
        setStockUnit("");
        break;
      case "displayQuantity":
        setDisplayQuantity("");
        break;
      case "displayUnit":
        setDisplayUnit("");
        break;
      case "description":
        setDescription("");
        break;
      case "discount":
        setDiscount("");
        break;
      case "imageFile":
        setImageFile(null);
        setImagePreview(null);
        break;
      default:
        break;
    }
  };

  // Clear all fields
  const handleClearAll = () => {
    setProductName("");
    setCategory("");
    setPrice("");
    setStockQuantity("");
    setStockUnit("");
    setDisplayQuantity("");
    setDisplayUnit("");
    setDescription("");
    setDiscount("");
    setImageFile(null);
    setImagePreview(null);
  };

  // Image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Convert safely → empty → 0
  const safeNumber = (val) => {
    if (val === "" || val === null || isNaN(val)) return 0;
    return Number(val);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("proName", productName);
    formData.append("category", category);
    formData.append("price", safeNumber(price));
    formData.append("stockQuantity", safeNumber(stockQuantity));
    formData.append("stockUnit", stockUnit);
    formData.append("displayQuantity", safeNumber(displayQuantity));
    formData.append("displayUnit", displayUnit);
    formData.append("description", description);
    formData.append("discount", safeNumber(discount));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const response = await fetch("http://localhost:8082/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(" Failed to add product: " + errorText);
        return;
      }

      const savedProduct = await response.json();
      console.log("Product added:", savedProduct);
      alert(" Product added successfully!");
      handleClearAll();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(" Server error. Check backend logs.");
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="form-title">
        <span className="form-title-icon">+</span> Add New Product
      </h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        {/* Left column */}
        <div className="form-column">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="white-input"
              required
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("productName")}
            >
              Clear
            </button>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="white-input"
              required
            >
              <option value="">-- Select Category --</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="beverages">Beverages</option>
              <option value="canned food">Canned Food</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="sea food">Sea Food</option>
              <option value="snacks">Snacks & Sweets</option>
            </select>
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("category")}
            >
              Clear
            </button>
          </div>

          <div className="form-group">
            <label>Price (Rs.) *</label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              min="0"
              onChange={(e) => setPrice(e.target.value)}
              className="white-input"
              required
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("price")}
            >
              Clear
            </button>
          </div>

          <div className="form-group stock-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              value={stockQuantity}
              min="0"
              onChange={(e) => setStockQuantity(e.target.value)}
              className="white-input"
            />
            <select
              value={stockUnit}
              onChange={(e) => setStockUnit(e.target.value)}
              className="white-input"
            >
              <option value="">-- Select Unit --</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                handleClear("stockQuantity");
                handleClear("stockUnit");
              }}
            >
              Clear
            </button>
          </div>

          <div className="form-group display-group">
            <label>Display Quantity (For customers)</label>
            <input
              type="number"
              placeholder="Enter display quantity"
              value={displayQuantity}
              min="0"
              onChange={(e) => setDisplayQuantity(e.target.value)}
              className="white-input"
            />
            <select
              value={displayUnit}
              onChange={(e) => setDisplayUnit(e.target.value)}
              className="white-input"
            >
              <option value="">-- Select Unit --</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                handleClear("displayQuantity");
                handleClear("displayUnit");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="form-column right">
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="white-input"
            ></textarea>
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("description")}
            >
              Clear
            </button>
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              placeholder="0"
              value={discount}
              min="0"
              onChange={(e) => setDiscount(e.target.value)}
              className="white-input"
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("discount")}
            >
              Clear
            </button>
          </div>

          <div className="form-group image-upload aligned-left">
            <label className="image-label">Upload Image</label>
            <div className="upload-box">
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="product-image" className="upload-label">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <span className="upload-icon">📷</span>
                )}
              </label>
            </div>
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("imageFile")}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Product
          </button>
          <button
            type="button"
            className="clear-all-btn"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
