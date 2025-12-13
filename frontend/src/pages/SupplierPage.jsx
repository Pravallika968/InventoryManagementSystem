import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const responseData = await ApiService.getAllSuppliers();
        if (responseData.status === 200) {
          setSuppliers(responseData.suppliers);
        } else {
          showMessage(responseData.message);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Suppliers: " + error
        );
        console.log(error);
      }
    };
    getSuppliers();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
        const res = await ApiService.deleteSupplier(supplierId);
        if (res.status === 200) {
          setSuppliers(suppliers.filter((s) => s.id !== supplierId));
          showMessage("Supplier deleted successfully");
        } else {
          showMessage(res.message || "Failed to delete supplier");
        }
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error deleting supplier: " + error
      );
    }
  };

  return (
    <Layout>
      <div className="supplier-page" style={{ padding: "20px" }}>
        <div className="supplier-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>Suppliers</h1>
          <button
            onClick={() => navigate("/add-supplier")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Supplier
          </button>
        </div>

        {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}

        {suppliers.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <thead>
                <tr style={{ backgroundColor: "#1976d2", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px" }}>{supplier.name || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
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
                        onClick={() => handleDeleteSupplier(supplier.id)}
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
          <p>No suppliers found</p>
        )}
      </div>
    </Layout>
  );
};

export default SupplierPage;
