import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/patientmedicalhistory.css';
import { useNavigate } from "react-router-dom";

export default function Pmedicalhistory() {
  const [records, setRecords] = useState([]);
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const patientid = localStorage.getItem("PatientCode");
  const navigate = useNavigate();
  



  useEffect(() => {

    //I used this method to fetch number of records 
    const fetchnumberofrecords = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientid}`);
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    fetchnumberofrecords();
    
  }, [patientid]);

  const viewdetails = async (patientId, serial_no) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`);
      setDetails(response.data);
      setIsModalOpen(true); // Show the modal with details
    } catch (error) {
      console.error("Error fetching record details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetails(null); // Clear details when closing the modal
  };

  return (
    <div>

      <button className="go-back-button" onClick={() => navigate(-1)}> {/* Back button */}
        Go Back
      </button>

      <h1 style={{ textAlign: 'center' }}>Your past medical history</h1>




      <div className="medical-container">
        {records.length > 0 ? (
          records.map((record, index) => (
            <div key={index} className="record">
              <h3>Treatment {index + 1}</h3>
              <p>Treatment Date: {new Date(record.MTD_CREATED_DATE).toISOString().split("T")[0]}</p>

              <p>Doctor: {record.MTD_DOCTOR}</p>
              <p>Status: {record.MTD_TREATMENT_STATUS === 'C'
                ? 'Complete'
                : record.MTD_TREATMENT_STATUS === 'P'
                  ? 'Preparation complete'
                  : 'Unknown'}</p>
              <button onClick={() => viewdetails(record.MTD_PATIENT_CODE, record.MTD_SERIAL_NO)}>View Details</button>
            </div>
          ))
        ) : (
          <p>No medical history records available.</p>
        )}

        {isModalOpen && details && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Medical History Details</h2>
              <div className="form-groupd">
                <label><strong>Complain:</strong></label>
                <textarea value={details.MTD_COMPLAIN} readOnly rows="7" />
              </div>


              
              <div className="form-groupd">
                <label><strong>Diagnostics:</strong></label>
                <textarea value={details.MTD_DIAGNOSTICS} readOnly rows="7" />
              </div>

              <div className="prescription-table-container">

                        <label style={{marginBottom:"10px"}}><strong>Allocated drugs</strong></label>
                        <table className="prescription-table1">
                            <thead>
                                <tr>
                                    <th style={{textAlign:"left"}}>Drug Name</th>
                                    <th style={{textAlign:"left"}}>Quantity</th>
                                    <th style={{textAlign:"left"}}>Number of takes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.Drugs.map((drug, index) => (
                                    <tr key={index}>
                                       <td style={{ textAlign: "left" }}> {drug.DrugName}</td>
                                        <td style={{ textAlign: "right" }}>{drug.MDD_QUANTITY}</td>
                                        <td style={{ textAlign: "left" }}>{drug.MDD_TAKES}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

              <div className="form-groupd">
                <label><strong>Doctor Remarks:</strong></label>
                <textarea value={details.MTD_REMARKS} readOnly rows="7" />
              </div>
              <button className="close-button" onClick={closeModal}>X</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
