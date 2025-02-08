import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/patientDetails.css";

export default function PatientDetails() {
    const { patientid } = useParams(); // Correct destructuring
    const [details, setDetails] = useState(null); // Initialize state as `null` or an empty object

    const fetchPatientDetails = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientid}`
            );
            setDetails(response.data); // Set the API response to state
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, [patientid]); // Fetch details when component mounts or `patientid` changes

   
    return (
        <div className="patient-details-container">
            <h1>Patient Page</h1>



            {/* {details.MPD_PATIENT_NAME}

            {details.MPD_MOBILE_NO} */}

            
            
        </div>
    );
}
