import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/viewRecord.css'; // Import the custom CSS
import { Spinner } from 'react-bootstrap';


export default function ViewRecord() {
    const { patientId, serial_no } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [patientdetails, setPatientdetails] = useState(null);
    const [patientError, setPatientError] = useState('');
    const [treatmentpopup1, setTreatmentpopup1] = useState('');
    const [updatedtreatmentpopup, setUpdatedtreatmentpopup] = useState('');
    const [treatmentnumber,setTreatmentnumber]= useState('');

    const handleContinue = () => {
        navigate(`/dashboard/remark/${patientId}/${serial_no}`);
    };

    const handleinvoice = (patientId,serial_no) => {


        navigate(`/dashboard/invoice/${patientId}/${serial_no}`);
    }


    const handleRemarks = () =>{

        navigate(`/dashboard/remark/${patientId}/${serial_no}`);
    }

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
                );
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching records:', error);
                setError('Failed to fetch patient records.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();

        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
                );
                setPatientdetails(response.data);
            } catch (error) {
                console.error('Error fetching patient details:', error);
                setPatientError('Failed to fetch patient details.');
            }
        };



       

        fetchPatientDetails();
    }, [patientId, serial_no]);


    const handleupdate = (serialNumber) => {


        navigate(`/dashboard/addrecord/${patientId}`, { state: { serialNumber } });
    }

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <div className="error-notification">{error}</div>;
    }



    return (
        <div className="view-record-container">
            <div className="header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                >
                    Back
                </button>
            </div>
            <div className="main">
                <div className="health-record">
                    <h2>Medical History</h2>
                    {/* <p style={{textAlign:"center"}}>( {details ? details.MTD_TYPE : 'Loading...'})</p> */}



                    <p style={{textAlign:"center", fontWeight:"bold"}}>Treatment number: {details.Treatmentnumber}</p>

                    <div className="details-header">
                        <p>
                            <strong>Date:</strong> {new Date(details.MTD_DATE).toISOString().split("T")[0]}


                            {/* <p>Treatment-date: {new Date(treatment.MTD_CREATED_DATE).toISOString().split("T")[0]}</p> */}
                        </p>

                        <p><strong>Prescribed doctor: </strong>{details.MTD_DOCTOR}</p>
                        {/* <p>
                            <strong>Doctor:</strong> 
                        </p> */}
                    </div>

                    <div className='details-header1'>
                        <p>
                            <strong>Name of patient: </strong>
                            {patientdetails ? patientdetails.MPD_PATIENT_NAME : 'Loading...'}
                        </p>
                    </div>


                    <div className="form-group">
                        <label><strong>Complain:</strong></label>
                        <textarea value={details.MTD_COMPLAIN} readOnly />
                    </div>
                    <div className="form-group">
                        <label><strong>Diagnostics:</strong></label>
                        <textarea value={details.MTD_DIAGNOSTICS} readOnly />
                    </div>



                    <label>Prescribed Medicines</label>
                    <div className="prescription-table-container">
                        <table className="prescription-table">
                            <thead>
                                <tr>
                                    <th style={{textAlign:"left"}}>Drug Name</th>
                                    <th style={{textAlign:"left"}}>Quantity</th>
                                    <th style={{textAlign:"left"}}>Takes</th>
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

                    <div className="form-group">
                        <label><strong>Doctor Remarks:</strong></label>
                        <textarea value={details.MTD_REMARKS} readOnly />
                    </div>

                    {/* <div className='details-header1'>

                        <p>

                           
                            <strong>Record type:</strong>{details ? details.MTD_TYPE : 'Loading...'}
                        </p>



                    </div> */}

                    <p>
                        <strong>Treatment condition:</strong>{" "}
                        {details.MTD_TREATMENT_STATUS === 'C'
                            ? 'Complete'
                            : details.MTD_TREATMENT_STATUS === 'P'
                                ? 'Preparation Complete'
                                : details.MTD_TREATMENT_STATUS === 'N'
                                    ? 'Not Completed'
                                    : 'Unknown Status'}
                    </p>



                    <div className='btn-container1'>

                        



                        <button
                            className="edit-btn"
                            onClick={() => handleupdate(details.MTD_SERIAL_NO)}
                        >
                            Edit details
                        </button>


                        <button
                        className='continue-button'
                        onClick={()=> handleRemarks(details.MTD_PATIENT_CODE,details.MTD_SERIAL_NO)}
                        
                        >

                            Remarks





                        </button>

                    


                        <button 
                         className='continue-button'
                         onClick={() => handleinvoice(details.MTD_PATIENT_CODE,details.MTD_SERIAL_NO)}
                         
                         
                         >Invoice</button>


                       
                    </div>




                </div>
            </div>

            {/* Render treatmentpopup1 */}
            {treatmentpopup1 && (
                <div className="popup-container">
                    {treatmentpopup1}
                </div>
            )}
        </div>
    );
}
