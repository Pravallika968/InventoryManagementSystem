import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import PaginationComponent from "../component/PaginationComponent";

const AdminUserPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [message, setMessage] = useState("");

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch all users
  const getUsers = async () => {
    try {
      const res = await ApiService.getAllUsers();

      if (res.status === 200 && res.users && res.users.length > 0) {
        setAllUsers(res.users);
        setTotalPages(Math.ceil(res.users.length / itemsPerPage));
        setDisplayUsers(res.users.slice(0, itemsPerPage));
      } else {
        setAllUsers([]);
        setDisplayUsers([]);
        setMessage("No users found");
      }
    } catch (error) {
      console.error(error);
      setAllUsers([]);
      setDisplayUsers([]);
      setMessage(error.response?.data?.message || "Error fetching users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Update displayed users when page changes
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    setDisplayUsers(allUsers.slice(start, end));
  }, [currentPage, allUsers]);

  // Delete user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await ApiService.deleteUser(userId);
        if (res.status === 200) {
          // Remove the deleted user from the list
          const updatedUsers = allUsers.filter((user) => user.id !== userId);
          setAllUsers(updatedUsers);

          // Show success alert
          alert("User deleted successfully");
        } else {
          alert(res.message || "Failed to delete user");
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Error deleting user");
      }
    }
  };

  return (
    <Layout>
      <div className="admin-user-page" style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>All Users</h1>
        {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}

        {displayUsers.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "600px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1976d2", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Email</th>
                  <th style={{ padding: "12px" }}>Phone Number</th>
                  <th style={{ padding: "12px" }}>Role</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px" }}>{user.name || "N/A"}</td>
                    <td style={{ padding: "12px" }}>{user.email || "N/A"}</td>
                    <td style={{ padding: "12px" }}>{user.phoneNumber || "N/A"}</td>
                    <td style={{ padding: "12px" }}>{user.role}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleDelete(user.id)}
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
          <p style={{ textAlign: "center" }}>No users found</p>
        )}

        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminUserPage;
