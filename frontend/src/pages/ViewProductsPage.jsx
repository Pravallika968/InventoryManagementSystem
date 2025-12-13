import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import PaginationComponent from "../component/PaginationComponent";

const ViewProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [message, setMessage] = useState("");

  const location = useLocation();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch products
  const getProducts = async () => {
    try {
      const res = await ApiService.getAllProducts();

      if (res.status === 200 && res.products) {
        const validProducts = res.products.filter((p) => p.productId != null);
        setAllProducts(validProducts);
        setTotalPages(Math.ceil(validProducts.length / itemsPerPage));
        setDisplayProducts(validProducts.slice(0, itemsPerPage));
      } else {
        setAllProducts([]);
        setDisplayProducts([]);
        setMessage("No products available");
      }
    } catch (error) {
      setAllProducts([]);
      setDisplayProducts([]);
      setMessage(error.response?.data?.message || "Error fetching products");
    }
  };

  useEffect(() => {
    getProducts();

    // Polling every 5 seconds to update stock quantity
    const interval = setInterval(() => {
      getProducts();
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [location]);

  // Update displayed products when page changes
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    setDisplayProducts(allProducts.slice(start, end));
  }, [currentPage, allProducts]);

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-page">
        <h1 style={{ textAlign: "center" }}>Products</h1>

        {displayProducts.length > 0 ? (
          <div className="product-list">
            {displayProducts.map((product) => (
              <div key={product.productId} className="product-item">
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
                  <p className="price">Price: ₹{product.price ?? "0"}</p>
                  <p className="quantity">
                    Quantity: {product.stockQuantity ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No products available</p>
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

export default ViewProductsPage;
