import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUsesInfo();
        setUser(userInfo);
        setFormData({
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          role: userInfo.role,
        });
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching user info"
        );
      }
    };
    fetchUserInfo();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await ApiService.updateCurrentUser(formData);
      setUser({ ...user, ...formData });
      setEditMode(false);
      showMessage("Profile updated successfully!");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating profile"
      );
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="profile-page">
        {user && (
          <div className="profile-card">
            <div className="profile-container">
              <div className="profile-picture">
                <img
                  src="/default.jpeg"
                  alt="Profile"
                />
              </div>

              <div className="profile-info">
                {["name", "email", "phoneNumber", "role"].map((field) => (
                  <div className="profile-item" key={field}>
                    <label>{field.replace(/([A-Z])/g, " $1")}</label>
                    {editMode ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{user[field]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-actions">
              {editMode ? (
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
