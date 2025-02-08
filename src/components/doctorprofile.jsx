import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/doctorprofile.css";

export default function Doctorprofile() {
  const [userDetails, setUserDetails] = useState({
    MUD_USER_NAME: "",
    MUD_USER_TYPE: "",
    MUD_SPECIALIZATION: "",
    MUD_STATUS: "",
    MUD_PHOTO: null,
    MUD_CONTACT: "",
    MUD_EMAIL: "",
    MUD_CREATED_DATE: "",
    MUD_NIC_NO: "",
    MUD_PASSWORD:"",
    MUD_FULL_NAME:"",
  });
  const [imagePreview, setImagePreview] = useState("default-profile-icon.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    MUD_CONTACT: "",
    MUD_EMAIL: "",
  });


  const id = localStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      console.error("User ID is missing");
      return;
    }

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/User/${id}`);
        const data = response.data;

        // Update MUD_USER_TYPE to "Doctor" if the response returns "doc"
        if (data.MUD_USER_TYPE === "Doc") {
          data.MUD_USER_TYPE = "Doctor";
        }
        if (data.MUD_USER_TYPE === "Phuser") {
          data.MUD_USER_TYPE = "Pharmacy user";
        }
        setUserDetails(data);

        if (data.MUD_PHOTO) {
          setImagePreview(`data:image/png;base64,${data.MUD_PHOTO}`);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  
    if (name === "MUD_CONTACT") {
      const isValidContact = /^[0-9]{10}$/.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        MUD_CONTACT: isValidContact ? "" : "Contact number must be 10 digits.",
      }));
    } else if (name === "MUD_EMAIL") {
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        MUD_EMAIL: isValidEmail ? "" : "Please enter a valid email address.",
      }));
    } else if (name === "MUD_NIC_NO") {
      const isValidNIC = /^[0-9]{9}[vV]$|^[0-9]{12}$/.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        MUD_NIC_NO: isValidNIC ? "" : "Please enter a valid NIC number.",
      }));
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const updateUserProfile = async () => {
    if (errors.MUD_CONTACT || errors.MUD_EMAIL || errors.MUD_NIC_NO) {
      alert("Please fix validation errors before updating the profile.");
      return;
    }
  
    const formData = new FormData();
    formData.append("MUD_USER_ID", id);
    formData.append("MUD_USER_NAME", userDetails.MUD_USER_NAME);
    formData.append(
      "MUD_USER_TYPE",
      userDetails.MUD_USER_TYPE === "Doctor" ? "Doc" : userDetails.MUD_USER_TYPE
    );
    formData.append("MUD_SPECIALIZATION", userDetails.MUD_SPECIALIZATION);
    formData.append("MUD_STATUS", userDetails.MUD_STATUS);
    formData.append("MUD_NIC_NO", userDetails.MUD_NIC_NO);
    formData.append("MUD_CONTACT", userDetails.MUD_CONTACT);
    formData.append("MUD_EMAIL", userDetails.MUD_EMAIL);
    formData.append("MUD_PASSWORD", userDetails.MUD_PASSWORD);
    formData.append("MUD_FULL_NAME",userDetails.MUD_FULL_NAME);
    
  
    if (selectedFile) {
      formData.append("MUD_PHOTO", selectedFile);
    }
  
    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/User/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data); // Display the error message from the server
      } else {
        alert("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats to DD/MM/YYYY
  };

  return (
    <div className="doctor-profile-container">
      <h1>Your Profile</h1>

      <label htmlFor="profileImageUpload" className="profile-image-label">
        <img src={imagePreview} alt="Profile" className="profile-icon" />
        <span className="edit-icon">✏️</span>
      </label>

      <input
        id="profileImageUpload"
        type="file"
        name="profileImage"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <div className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="MUD_USER_NAME"
              value={userDetails.MUD_USER_NAME || ""}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input

            type="password"
            name="MUD_PASSWORD"
            value={userDetails.MUD_PASSWORD || ""}
            onChange={handleInputChange}  
            
            
            />

          </div>


          <div className="form-group">
            <label>Name</label>
            <input

            type="text"
            name="MUD_FULL_NAME"
            value={userDetails.MUD_FULL_NAME || ""}
            onChange={handleInputChange}
            placeholder="Enter your full name"
               
            />
          </div>
          <div className="form-group">
            <label>NIC number</label>
            <input
              type="text"
              name="MUD_NIC_NO"
              value={userDetails.MUD_NIC_NO || ""}
              onChange={handleInputChange}
              placeholder="Add NIC"
            />
            {errors.MUD_NIC_NO && <span className="error-text">{errors.MUD_NIC_NO}</span>}
          </div>

          <div className="form-group">
            <label>User Category</label>
            <input
              type="text"
              name="MUD_USER_TYPE"
              value={userDetails.MUD_USER_TYPE || ""}
              onChange={handleInputChange}
              placeholder="Enter user category"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Registered Date</label>
            <input
              type="text"
              name="MUD_CREATED_DATE"
              value={formatDate(userDetails.MUD_CREATED_DATE) || ""}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="MUD_EMAIL"
              value={userDetails.MUD_EMAIL || ""}
              onChange={handleInputChange}
              placeholder="Enter email"
            />

            {errors.MUD_EMAIL && <span className="error-text">{errors.MUD_EMAIL}</span>}
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input
              type="text"
              name="MUD_CONTACT"
              value={userDetails.MUD_CONTACT || ""}
              onChange={handleInputChange}
            />
            {errors.MUD_CONTACT && <span className="error-text">{errors.MUD_CONTACT}</span>}
          </div>

         
        </div>

        <button onClick={updateUserProfile} className="update-profile-button" disabled={loading}>
          {loading ? "Updating..." : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}