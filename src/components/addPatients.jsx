


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Addpatient = ({ patientCode }) => {
    const Name = localStorage.getItem("Name");
    const [formData, setFormData] = useState({
        MPD_PATIENT_NAME: '',
        MPD_MOBILE_NO: '',
        MPD_NIC_NO: '',
        MPD_PATIENT_REMARKS: '',
        MPD_ADDRESS: '',
        MPD_CITY: '',
        MPD_REMARKS: '',
        MPD_GUARDIAN: '',
        MPD_GUARDIAN_CONTACT_NO: '',
        MPD_PATIENT_CODE: '',
        MPD_EMAIL: '',
        MPD_PATIENT_TYPE: '',
        MPD_STATUS: '',
        MPD_CREATED_BY: Name,
        MPD_UPDATED_BY: '',
        MPD_BIRTHDAY: null,
        MPD_GENDER:'',
        MPD_CREATED_DATE: new Date().toISOString(),
        MPD_UPDATED_DATE: null,
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({
        email: '',
        contact: '',
        nic: '',
        guardianContact: '', 
    });

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (patientCode) {
            setIsEditMode(true);
            fetchPatientDetails(patientCode);
        }
    }, [patientCode]);

    const fetchPatientDetails = async (patientCode) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient/${patientCode}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    const validateGuardianContact = (contact) => {
        const contactPattern = /^[0-9]{10}$/; // Validates 10-digit contact number
        return contactPattern.test(contact);
    };

    const validateNIC = (nic) => {
        // Check if it's 10 characters long and matches the pattern
        const tenCharNIC = /^[0-9]{9}[VXvx]$/;
        // Check if it's 12 digits long
        const twelveCharNIC = /^[0-9]{12}$/;
        return tenCharNIC.test(nic) || twelveCharNIC.test(nic);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errors = { ...formErrors };
    
        // Allow empty email without error
        if (name === 'MPD_EMAIL') {
            errors.email = value.trim() === '' || validateEmail(value) ? '' : 'Invalid email format';
        }
        if (name === 'MPD_MOBILE_NO') {
            errors.contact = value.trim() === '' || validateContactNumber(value) ? '' : 'Contact number should be 10 digits';
        }
        if (name === 'MPD_GUARDIAN_CONTACT_NO') {
            errors.guardianContact = value.trim() === '' || validateContactNumber(value) ? '' : 'Guardian contact number should be 10 digits';
        }
        if (name === 'MPD_NIC_NO') {
            errors.nic = value.trim() === '' || validateNIC(value) ? '' : 'Invalid NIC format';
        }
    
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors(errors);
    };
    
    

    const validateEmail = (email) => {

        if (email.trim() === '') {
            return true; // Allow empty values
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const validateContactNumber = (contact) => {
        const contactPattern = /^[0-9]{10}$/;
        return contactPattern.test(contact);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Check if there are any errors before submitting
    if (formErrors.email || formErrors.contact || formErrors.nic) {
        setErrorMessage('Please correct the errors before submitting the form.');
        return;
      }
  
        try {
            if (isEditMode) {
                // Update patient data
                await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/Patient/update/${formData.MPD_PATIENT_CODE}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert("Patient details updated successfully");
            } else {
                // Register new patient
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Patient/patient-registration`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert("Patient registered successfully");
                console.log(formData);
            }
            window.location.reload();
        } catch (error) {
            console.error("Failed to save patient details", error.response?.data || error.message);
            setErrorMessage(`Failed to save patient details: ${error.response?.data?.error || 'Unknown error'}`);
        }
    };

    return (
        <div>
            <div className="add-patient-form-container">
                <h2 className="form-title">{isEditMode ? 'Patient details' : 'Patient Registration Form'}</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form className="patient-form" onSubmit={handleSubmit}>
                    <div className="form-section1">
                        <div className="form-grid1">
                            <div className="form-group">
                                <label>Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="MPD_PATIENT_NAME"
                                    value={formData.MPD_PATIENT_NAME}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>NIC Number</label>
                                <input
                                    type="text"
                                    name="MPD_NIC_NO"
                                    value={formData.MPD_NIC_NO}
                                    onChange={handleChange}
                                />
                                {formErrors.nic && <div className="error-message">{formErrors.nic}</div>}
                            </div>
                            <div className="form-group">
                                <label>Contact Number <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="MPD_MOBILE_NO"
                                    value={formData.MPD_MOBILE_NO}
                                    onChange={handleChange}
                                    required
                                />
                                {formErrors.contact && <div className="error-message">{formErrors.contact}</div>}
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="MPD_ADDRESS"
                                    value={formData.MPD_ADDRESS}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>City <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="MPD_CITY"
                                    value={formData.MPD_CITY}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                            <div className="form-group">
                                <label>Guardian <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="MPD_GUARDIAN"
                                    value={formData.MPD_GUARDIAN}
                                    onChange={handleChange}
                                
                                />
                            </div>
                            <div className="form-group">
                                <label>Guardian Contact No <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="MPD_GUARDIAN_CONTACT_NO"
                                    value={formData.MPD_GUARDIAN_CONTACT_NO}
                                    onChange={handleChange}
                                    
                                />
                                {formErrors.guardianContact && <div className="error-message">{formErrors.guardianContact}</div>}
                            </div>
                            <div className='form-group'>
                                <label>Enter your birthday <span className='required'></span></label>
                                <input
                                    type="date"
                                    name="MPD_BIRTHDAY"
                                    value={formData.MPD_BIRTHDAY}
                                    onChange={handleChange}
                                
                                />
                            </div>
                            <div className='form-group'>
                                <label>Enter your email <span className='required'></span></label>
                                <input
                                    type="email"
                                    name="MPD_EMAIL"
                                    value={formData.MPD_EMAIL}
                                    onChange={handleChange}
                                
                                />
                                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                            </div>

                            <div className='form-group'>
                                <label>Gender</label>
                                <select
                                  name="MPD_GENDER"
                                  value={formData.MPD_GENDER}
                                  onChange={handleChange}
                                   
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Patient Remarks</label>
                        <textarea
                            name="MPD_PATIENT_REMARKS"
                            value={formData.MPD_PATIENT_REMARKS}
                            onChange={handleChange}
                            style={{ height: "100px", border: '1px solid #cccccc' }}
                        />
                    </div>
                    <button type="submit" style={{ marginBottom: "20px" }} className="submit-button">
                        {isEditMode ? 'Update details' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Addpatient;

