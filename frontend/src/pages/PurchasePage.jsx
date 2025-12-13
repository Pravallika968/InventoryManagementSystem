import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const PurchasePage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        const supplierData = await ApiService.getAllSuppliers();

        // Adjust according to API response: check if your objects use id/productId
        setProducts(productData.products || []);
        setSuppliers(supplierData.suppliers || []);
      } catch (error) {
        showMessage("Error fetching products or suppliers");
      }
    };

    fetchProductsAndSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !supplierId || !quantity) {
      showMessage("Please fill in all required fields");
      return;
    }

    const body = {
      productId: parseInt(productId, 10),  // ensures number is sent
      supplierId: parseInt(supplierId, 10), // ensures number is sent
      quantity: parseInt(quantity, 10),
      description: description || "",
      note: note || "",
    };

    console.log("Sending purchase request:", body); // debug

    try {
      const response = await ApiService.purchaseProduct(body);
      showMessage(response.message || "Purchase successful");
      resetForm();
    } catch (error) {
      showMessage(error.response?.data?.message || "Error during purchase");
    }
  };

  const resetForm = () => {
    setProductId("");
    setSupplierId("");
    setQuantity("");
    setDescription("");
    setNote("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="purchase-form-page">
        <h1>Receive Inventory</h1>

        <form onSubmit={handleSubmit}>
          {/* Product Dropdown */}
          <div className="form-group">
            <label>Select Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option
                  key={product.productId ?? product.id}
                  value={product.productId ?? product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Dropdown */}
          <div className="form-group">
            <label>Select Supplier</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
            >
              <option value="">Select a supplier</option>
              {suppliers.map((supplier) => (
                <option
                  key={supplier.supplierId ?? supplier.id}
                  value={supplier.supplierId ?? supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
            />
          </div>

          <button type="submit">Purchase Product</button>
        </form>
      </div>
    </Layout>
  );
};

export default PurchasePage;
