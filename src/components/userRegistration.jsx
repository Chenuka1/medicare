import React, { useState } from 'react';
import '../styles/userRegistration.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Userregistration() {
  const [formData, setFormData] = useState({
    MPD_EMAIL: '',
    MPD_NIC_NO: '',
    MPD_MOBILE_NO: '',
    MPD_ADDRESS: '',
    MPD_PASSWORD: '',
    MPD_PATIENT_NAME: '',
    MPD_BIRTHDAY: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    contact: '',
    nic: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate("");

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateContactNumber = (contact) => {
    const contactPattern = /^[0-9]{10}$/; // Adjust pattern as per your country's phone format
    return contactPattern.test(contact);
  };
  const validateNIC = (nic) => {
    const nicPattern = /^[0-9]{9}[vV]$|^[0-9]{12}$/;
    return nicPattern.test(nic);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
        ...formData,
        [name]: value,
    });

    // Create a copy of the current errors
    let updatedErrors = { ...formErrors };

    // Validate email
    if (name === 'MPD_EMAIL') {
        updatedErrors.email = value.trim() === '' || validateEmail(value) ? '' : 'Please enter a valid email address.';
    }

    // Validate contact number
    if (name === 'MPD_MOBILE_NO') {
        updatedErrors.contact = value.trim() === '' || validateContactNumber(value) ? '' : 'Please enter a valid 10-digit contact number.';
    }

    // Validate guardian contact number
    if (name === 'MPD_GUARDIAN_CONTACT_NO') {
        updatedErrors.guardianContact = value.trim() === '' || validateContactNumber(value) ? '' : 'Please enter a valid 10-digit guardian contact number.';
    }

    // Validate NIC
    if (name === 'MPD_NIC_NO') {
        updatedErrors.nic = value.trim() === '' || validateNIC(value) ? '' : 'Please enter a valid NIC.';
    }

    // Update form errors
    setFormErrors(updatedErrors);
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any errors before submitting
    if (formErrors.email || formErrors.contact || formErrors.nic) {
      setErrorMessage('Please correct the errors before submitting the form.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Patient/patient-registration`, formData);
      setSuccessMessage('Patient registered successfully!');
      setErrorMessage('');
      alert("User registered successfully");
      console.log(formData);
      setFormData({

      MPD_EMAIL: '',
      MPD_NIC_NO: '',
      MPD_MOBILE_NO: '',
      MPD_ADDRESS: '',
      MPD_PASSWORD: '',
      MPD_PATIENT_NAME: '',
      MPD_BIRTHDAY: '',

      })
      navigate("/");

      console.log(formData);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Failed to register user. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      MPD_EMAIL: '',
      MPD_NIC_NO: '',
      MPD_MOBILE_NO: '',
      MPD_ADDRESS: '',
      MPD_PASSWORD: '',
      MPD_PATIENT_NAME: '',
      MPD_BIRTHDAY: '',
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="user-registration-container">
      <div className="user-registration">
        <form onSubmit={handleSubmit} className="registration-form">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <h1>Register Patients</h1>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="MPD_PATIENT_NAME"
              value={formData.MPD_PATIENT_NAME}
              onChange={handleChange}
              placeholder='enter your name'
              required
            />
          </div>


          <div className="form-group">
            <label>Contact</label>
            <input
              type="number"
              name="MPD_MOBILE_NO"
              placeholder="Enter your contact"
              value={formData.MPD_MOBILE_NO}
              onChange={handleChange}
              required
              maxLength="10"
            />
            {formErrors.contact && <div className="error-message1">{formErrors.contact}</div>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="MPD_EMAIL"
              placeholder=" optional"
              value={formData.MPD_EMAIL}
              onChange={handleChange}
            
            />
            {formErrors.email && <div className="error-message1">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label>NIC</label>
            <input
              type="text"
              name="MPD_NIC_NO"
              placeholder="Enter your NIC"
              value={formData.MPD_NIC_NO}
              onChange={handleChange}
              
            />
            {formErrors.nic && <div className="error-message1">{formErrors.nic}</div>}
          </div>

          

          
          
          <div className='form-group'>
            <label>Birthdate</label>
            <input
              type="date"
              name="MPD_BIRTHDAY"
              placeholder="Enter your birthdate"
              value={formData.MPD_BIRTHDAY}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="MPD_ADDRESS"
              placeholder="Enter your address"
              value={formData.MPD_ADDRESS}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Register
          </button>

          {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
      </div>
    </div>
  );
}
