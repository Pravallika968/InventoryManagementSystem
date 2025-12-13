import React, { useEffect, useState, useCallback } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const categoryRes = await ApiService.getAllCategory();
      if (categoryRes.status === 200) setCategories(categoryRes.categories);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Show message temporarily
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // Add category
  const addCategory = async () => {
    if (!categoryName) {
      showMessage("Category name cannot be empty");
      return;
    }
    try {
      await ApiService.createCategory({ name: categoryName });
      showMessage("Category successfully added");
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      showMessage(error.response?.data?.message || "Error adding category");
    }
  };

  // Edit category
  const editCategory = async () => {
    try {
      await ApiService.updateCategory(editingCategoryId, { name: categoryName });
      showMessage("Category successfully updated");
      setIsEditing(false);
      setCategoryName("");
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      showMessage(error.response?.data?.message || "Error updating category");
    }
  };

  // Populate edit form
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await ApiService.deleteCategory(categoryId);
        showMessage("Category successfully deleted");
        fetchCategories();
      } catch (error) {
        showMessage(error.response?.data?.message || "Error deleting category");
      }
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Categories</h1>

        {message && (
          <div style={{ color: "green", marginBottom: "15px", fontWeight: "500" }}>
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              flex: 1,
            }}
          />
          {!isEditing ? (
            <button
              onClick={addCategory}
              style={{
                padding: "8px 16px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add Category
            </button>
          ) : (
            <button
              onClick={editCategory}
              style={{
                padding: "8px 16px",
                backgroundColor: "#388e3c",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          )}
        </div>

        {categories.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "400px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1976d2", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Category Name</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px" }}>{category.name || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEditCategory(category)}
                        style={{
                          padding: "6px 12px",
                          marginRight: "8px",
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
