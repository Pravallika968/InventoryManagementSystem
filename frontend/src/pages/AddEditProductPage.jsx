import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
  const { productId } = useParams("");
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStokeQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getAllCategory();
        setCategories(categoriesData.categories);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting all Categories: " + error
        );
      }
    };

    const fetProductById = async () => {
      if (productId) {
        setIsEditing(true);
        try {
          const productData = await ApiService.getProductById(productId);
          if (productData.status === 200) {
            setName(productData.product.name);
            setSku(productData.product.sku);
            setPrice(productData.product.price);
            setStokeQuantity(productData.product.stockQuantity);
            setCategoryId(productData.product.categoryId);
            setDescription(productData.product.description);
            setImageUrl(productData.product.imageUrl);
          } else {
            showMessage(productData.message);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message || "Error Getting a Product by Id: " + error
          );
        }
      }
    };

    fetchCategories();
    if (productId) fetProductById();
  }, [productId]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      if (isEditing) {
        formData.append("productId", productId);
        await ApiService.updateProduct(formData);
        showMessage("Product successfully updated");
      } else {
        await ApiService.addProduct(formData);
        showMessage("Product successfully saved 🤩");
      }
      navigate("/product");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Saving a Product: " + error
      );
    }
  };

  return (
    <Layout>
      <div
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>

        {message && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#d4edda",
              color: "#155724",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/** Product Name */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/** SKU & Quantity Row */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "15px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Stock Quantity
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStokeQuantity(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          {/** Description */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                minHeight: "80px",
              }}
            />
          </div>

          {/** Category */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/** Image Upload */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Product Image</label>
            <input type="file" onChange={handleImageChange} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                style={{
                  marginTop: "10px",
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>

          {/** Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isEditing ? "#388e3c" : "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditProductPage;
