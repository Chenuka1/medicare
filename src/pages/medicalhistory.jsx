import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/addPatient.css';
import '../styles/medicalhistory.css';
import Addpatient from '../components/addPatients';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function MedicalHistory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState(null);
    const [treatmentPopup, setTreatmentPopup] = useState(null);
    const navigate = useNavigate();
    const [patientPopup, setPatientPopup] = useState(null);
    const [personaldetails, setPersonaldetails] = useState(null);

    const [remarkpopup, setremarkPopup] = useState(null)

    // Define the fetchAllPatients function
    const fetchAllPatients = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient`);
            setPatients(response.data);
            setFilteredPatients(response.data); // Initially, set filteredPatients to all patients
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Failed to load patient data.');
            setPatients([]);
            setFilteredPatients([]);
        } finally {
            setIsLoading(false);
        }
    };


    

    // Fetch all patients when the component mounts
    useEffect(() => {
        fetchAllPatients();
    }, []);

    // Filter patients by search term (real-time filtering)
    useEffect(() => {
        if (searchTerm) {
            const filtered = patients.filter((patient) =>
                patient.MPD_MOBILE_NO.toLowerCase().includes(searchTerm.toLowerCase()) || patient.MPD_PATIENT_NAME.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
            setErrorMessage(filtered.length === 0 ? 'No matching patients found.' : '');
        } else {
            setFilteredPatients(patients); // Reset to all patients if searchTerm is empty
        }
    }, [searchTerm, patients]);

    const handleSearch = async () => {
        if (!searchTerm) {
            // If search term is empty, fetch all patients
            await fetchAllPatients();
            setErrorMessage(''); // Clear any error message
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient/SearchBy/${searchTerm}`);
            setPatients(response.data);
            setErrorMessage('');
            setPopup(null);
            setTreatmentPopup(null);
        } catch (error) {
            setPatients([]);
            if (error.response && error.response.status === 404) {
                setErrorMessage('No patient found with the provided search term.');
                setPopup(<Addpatient />);
            } else {
                setErrorMessage('An error occurred while searching for the patient.');
                setPopup(null);
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleAddRecord = (patientId) => {
        setTreatmentPopup(null);
        navigate(`/dashboard/addrecord/${patientId}`);
    };


    const handleViewRecord = async (patientId) => {
        try {
            setErrorMessage('');
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientId}`);
            setTreatmentPopup(
                <div className="treatment-popup">
                    <button className="close-popup-button" onClick={() => setTreatmentPopup(null)}>X</button>
                    <h2>Treatment Details</h2>
                    <div className="treatment-list">

                        {response.data.map((treatment, index) => (


                            <div className="treatment-card" key={index}>
                                <h3>{index + 1}</h3>
                                <p>Treatment-date: {new Date(treatment.MTD_CREATED_DATE).toISOString().split("T")[0]}</p>
                                <b><p className="complain-text">Complain: {treatment.MTD_COMPLAIN}</p></b>
                                <button onClick={() => { navigate(`/dashboard/view-record/${patientId}/${treatment.MTD_SERIAL_NO}`) }}>View info</button>
                            </div>

                        ))}
                    </div>
                    {/* <button className="close-popup-button" onClick={() => setTreatmentPopup(null)}>Close</button> */}
                </div>
            );
        } catch (error) {
            console.error('Error fetching treatment details:', error);
            setErrorMessage('No treatments available.');
            setTreatmentPopup(null);
        }
    };

    const handleNoPatient = () => {
        setPopup(<Addpatient />);
    };

    const closePopup = () => {
        setPopup(null);
    };





    // viewPatient function
    const viewPatient = (patientCode) => {
        setPopup(<Addpatient patientCode={patientCode} />);  // Pass patientCode as a prop to Addpatient
    };




    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete the patient?")) {
            try {
                // Check if the patient has treatments
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient/${id}`);

                if (response.data && response.data.length > 0) {
                    alert("This patient cannot be deleted as they have treatments associated.");
                    return;
                }

                // Proceed with deletion if no treatments are found
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Patient/${id}`);
                alert("Patient deleted successfully!");

                // Reload or update the UI after deletion
                window.location.reload();
            } catch (error) {
                console.error("Error deleting patient:", error);
                alert(error.response?.data?.message || "Failed to delete the patient. Please try again.");
            }
        }
    };








    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };


    const patientdetails = (patientid) => {

        navigate(`/dashboard/patientdetails/${patientid}`);



    }

    return (
        <div className="medical-history-container">
            <h1 className="title">Search Patient Records</h1>
            <div className="search-container">
                <input
                    type="search"
                    placeholder="Enter patient name or contact number"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="button-container">
                    <button className="search-button" onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                    <button className="no-patient-button" onClick={handleNoPatient}>
                        Add Patient
                    </button>
                </div>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {filteredPatients.length > 0 && (
                <div className="patient-details">
                    <table className="records-table">
                        <thead>
                            <tr>
                                <th>Patient Code</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>NIC</th>

                                <th>Age</th>


                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.MPD_PATIENT_CODE}>
                                    <td>{patient.MPD_PATIENT_CODE}</td>
                                    <td>{patient.MPD_PATIENT_NAME}</td>
                                    <td>{patient.MPD_MOBILE_NO}</td>

                                    <td>{patient.MPD_NIC_NO}</td>
                                    <td>{calculateAge(patient.MPD_BIRTHDAY)}</td>


                                    <td>

                                        <div className='btn-cotainers'>
                                            <div className="dropdown">
                                                {/* <button className="dropdown-toggle action-button">
                                            Actions <i className="fas fa-chevron-down"></i>
                                            </button> */}
                                                {/* <div className="dropdown-menu">
                                                <button onClick={() => viewPatient(patient.MPD_PATIENT_CODE)}>View  Details</button>
                                               
                                                <button onClick={() => handleDelete(patient.MPD_PATIENT_CODE)}>Delete Patient</button>
                                            </div> */}
                                            </div>

                                            <button className="action-button" onClick={() => viewPatient(patient.MPD_PATIENT_CODE)}>View  Details</button>

                                            <button
                                                className="action-button"
                                                onClick={() => handleAddRecord(patient.MPD_PATIENT_CODE)}
                                            >
                                                <i className="fas fa-plus"></i> Add Treatment
                                            </button>

                                            <button
                                                className="action-button"
                                                onClick={() => handleViewRecord(patient.MPD_PATIENT_CODE)}
                                            >
                                                <i className="fas fa-eye"></i> View Treatments
                                            </button>






                                        </div>






                                    </td>




                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}



            {popup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup-button" onClick={closePopup}>X</button>
                        {popup}
                    </div>
                </div>
            )}

            {treatmentPopup && (
                <div className="popup-overlay">

                    <div className="">
                        {treatmentPopup}
                    </div>
                </div>
            )}




            {patientPopup && (

                <div className='popup-overlay'>

                    <div className=''>

                        {patientPopup}




                    </div>


                </div>




            )}



        </div>
    );
}
