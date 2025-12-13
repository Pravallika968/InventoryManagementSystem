import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import PaginationComponent from "../component/PaginationComponent";

const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch logged-in user role
  const fetchUserRole = async () => {
    try {
      const userInfo = await ApiService.getLoggedInUsesInfo();
      setUserRole(userInfo.role);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching user info");
    }
  };

  // Fetch all products
  const getProducts = async () => {
    try {
      const res = await ApiService.getAllProducts();
      if (res.status === 200 && res.products) {
        setAllProducts(res.products);
        setTotalPages(Math.ceil(res.products.length / itemsPerPage));
        setDisplayProducts(res.products.slice(0, itemsPerPage));
      } else {
        setAllProducts([]);
        setDisplayProducts([]);
        setMessage(res.message || "No products available");
      }
    } catch (error) {
      setAllProducts([]);
      setDisplayProducts([]);
      setMessage(error.response?.data?.message || "Error fetching products");
    }
  };

  useEffect(() => {
    fetchUserRole();
    getProducts();

    // Polling every 5 seconds to get updated stock (simple approach)
    const interval = setInterval(() => {
      getProducts();
    }, 5000);

    return () => clearInterval(interval);
  }, [location]);

  // Update displayed products when page changes
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    setDisplayProducts(allProducts.slice(start, end));
  }, [currentPage, allProducts]);

  // Delete product (Admin only)
  const handleDeleteProduct = async (productId) => {
    if (userRole !== "ADMIN") return;
    if (!productId) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await ApiService.deleteProduct(productId);
        if (res.status === 200) {
          const updatedProducts = allProducts.filter((p) => p.productId !== productId);
          setAllProducts(updatedProducts);
          setMessage("Product successfully deleted");

          if ((currentPage - 1) * itemsPerPage >= updatedProducts.length && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          setMessage(res.message || "Failed to delete product");
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Error deleting product");
      }
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-page">
        <div className="product-header">
          <h1>Products</h1>
          {userRole === "ADMIN" && (
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </button>
          )}
        </div>

        {displayProducts.length > 0 ? (
          <div className="product-list">
            {displayProducts.map((product) => (
              <div key={product.productId || Math.random()} className="product-item">
                <img
                  className="product-image"
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.name || "Product"}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <div className="product-info">
                  <h3 className="name">{product.name || "Unnamed Product"}</h3>
                  <p className="sku">Sku: {product.sku || "N/A"}</p>
                  <p className="price">Price: ₹{product.price ?? 0}</p>
                  <p className="quantity">Quantity: {product.stockQuantity ?? 0}</p>
                </div>
                {userRole === "ADMIN" && (
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-product/${product.productId}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.productId)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No products available</p>
        )}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};

export default ProductPage;
