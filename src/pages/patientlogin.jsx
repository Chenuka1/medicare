import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/patientlogin.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function Patientlogin() {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popupmessage, setPoupmessage] = useState("");
  const [patientdetails, setPatientdetails] = useState([]);
  const [patientlistpopup, setPatientlistpopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate();
  const [patientid, setPatienid] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const validateContact = (contact) => /^[0-9]{10}$/.test(contact);

  const checkUserExists = async (contact) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/CheckUserExists`,
        { contact }
      );
      return response.status === 200; // Return true if user exists
    } catch (error) {
      setErrorMessage("User not registered. Please sign up first.");
      return false;
    }
  };

  const sendOtp = async () => {

    if (!validateContact(contact)) {
      setErrorMessage("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    const userExists = await checkUserExists(contact);
    if (!userExists) return;

    if (!validateContact(contact)) {
      setErrorMessage("Please enter a valid 10-digit contact number.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/patient-login-contact`,
        { contact }
      );

      console.log(response.data);

      setGeneratedOtp(response.data.otpcode); // Store the OTP code in state

      setPoupmessage("OTP sent to your contact. Please check.");
      setIsOtpSent(true);

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };






  


  const proceedWithLogin = async () => {
    if (!selectedPatient) {
      setErrorMessage("Please select a user to proceed.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/patient-login-api`,
        { patientcode: selectedPatient.MPD_PATIENT_CODE }
      );

      localStorage.setItem('Token', response.data.Token);
      localStorage.setItem('Email', response.data.Email);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('PatientCode', selectedPatient.MPD_PATIENT_CODE);
      localStorage.setItem('Name', selectedPatient.MPD_PATIENT_NAME);
      localStorage.setItem('Contact', selectedPatient.MPD_MOBILE_NO);
      localStorage.setItem('Role', response.data.Role);

      setErrorMessage("");
      setPatientlistpopup(false); // Close the popup
      navigate('/home');
    } catch (error) {
      setErrorMessage("An error occurred during login.");
    }
  };


  const fetchPatientList = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/userlists`,
        { contact }
      );

      setPatientdetails(response.data);
      setPoupmessage("Here are the users with the same contact number:");
      setPatientlistpopup(true); // Show the popup
    } catch (error) {
      setErrorMessage("Failed to fetch patient details.");
    }
  };


  const handleLogin = async () => {
    if (otp === generatedOtp?.toString()) {
      await fetchPatientList(); // Fetch patient list after OTP verification
    } else {
      setErrorMessage("Invalid OTP. Please check your contact.");
    }
  };

  const handleCancel = () => {
    setContact("");
    setOtp("");
    setIsOtpSent(false);
    setErrorMessage(""); // Clear any previous error message
  };



  return (
    <div className="login-page-container">
      <div className="left-login-page-container">
        <div className="welcome-patient-message">
          {/* <h1>Welcome Back!</h1> */}
        </div>
      </div>

      <div className="right-login-page-container">
        <div className="form-content">
          <h1 style={{ textAlign: "center" }}>Welcome Back!</h1>
          <p className="intro-text">Please log in to your account</p>

          <div className="group1">
            <label>Contact</label>
            <input
              type="text"
              placeholder="Please enter your contact"
              value={contact}
              max={10}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {!isOtpSent && <button className="b1" onClick={sendOtp}>Send OTP</button>}

          {isOtpSent && (
            <>
              {popupmessage && <p className="popup-message-login">{popupmessage}</p>}
              <label style={{ marginTop: "10px" }}>OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="button-container">
                <button className="b1" onClick={handleLogin}>Login</button>
                <button className="b1" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          )}

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <p>
            Don't have an account?<Link to="/addusers"> Create One</Link>
          </p>

          {/* Display the patient list popup */}
          {patientlistpopup && (
            <div className="popup-patient">
              <div className="popup-content-patient">
                <button className="close-button" onClick={() => setPatientlistpopup(false)}>
                  &times;
                </button>
                <h3>Select user</h3>
                {patientdetails.length > 0 ? (
                  <div className="user-list">
                    {patientdetails.map((patientDetail, index) => (
                      <div key={index} className="list">
                        <label htmlFor={`patient-${index}`}>
                          {patientDetail.MPD_PATIENT_NAME}
                        </label>
                        <input
                          type="checkbox"
                          id={`patient-${index}`}
                          checked={selectedPatient === patientDetail}
                          style={{width:"5%"}}
                          onChange={() =>
                            setSelectedPatient(
                              selectedPatient === patientDetail ? null : patientDetail
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No users found.</p>
                )}
                <button className="b1" onClick={proceedWithLogin} disabled={!selectedPatient}>
                  Proceed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
