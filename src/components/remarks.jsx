
import axios from 'axios';
import logo from '../assets/medicare_logo.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Remarks.css';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';

export default function Remarks() {
    const { patientId, serial_no } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [patientdetail, setPatientdetail] = useState('');
    const [doctorRemarks, setDoctorRemarks] = useState('');
    const navigate = useNavigate("");

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`);
                setDetails(response.data);
                setDoctorRemarks(response.data.MTD_REMARKS || '');
            } catch (error) {
                console.error('Error fetching records:', error.response ? error.response.data : error.message);
                setError('Failed to fetch patient records. ' + (error.response ? error.response.data : error.message));
            }
        };

        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`);
                setPatientdetail(response.data);
            } catch (error) {
                console.error('Error fetching patient details:', error.response ? error.response.data : error.message);
                setError('Failed to fetch patient details. ' + (error.response ? error.response.data : error.message));
            }
        };

        fetchRecords();
        fetchPatients();
    }, [patientId, serial_no]);

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

    const handleViewInvoice = () => {
        navigate(`/dashboard/invoice/${patientId}/${serial_no}`);
    };

    const handlePrint = () => {
        window.print();
    };

    const downloadInvoice = () => {
        const invoiceElement = document.querySelector('.remarks-container');
        
        // Add a class to hide the buttons
        invoiceElement.classList.add('hide-elements');
    
        const opt = {
            margin: 0.5,
            filename: `invoice_${patientId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        html2pdf().from(invoiceElement).set(opt).save().then(() => {
            // Remove the hide class after the PDF is saved
            invoiceElement.classList.remove('hide-elements');
        });
    };
    

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!details || !patientdetail) {
        return <div className="loading-message">Loading...</div>;
    }

    return (
        <div className="remarks-container">
              <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            
            <header className="header1">
                <div className='logo-container'>
                    <img src={logo} alt="Medilink Logo" className="logo" />
                </div>
                <div className="contact-info">
                    <p>85/1, Horana Road, Bandaragama.<br />
                    Tel: 0771068887<br />
                    Email: Medilink@gmail.com<br />
                    Web: www.medilink.lk</p>
                </div>
            </header>

            <h2 className="section-title">Doctor remarks</h2>

            <div className='patient-details'>
                <p><strong>Patient Name:</strong> {patientdetail.MPD_PATIENT_NAME}</p>
                <p><strong>Age:</strong> {calculateAge(patientdetail.MPD_BIRTHDAY)}</p>
                <p><strong>Date:</strong> {new Date(details.MTD_DATE).toLocaleDateString()}</p>
            </div>

            <h3 className="section-subtitle">Doctor's Remarks</h3>
            <textarea
                className="doctor-remarks"
                value={doctorRemarks}
                onChange={(e) => setDoctorRemarks(e.target.value)}
            ></textarea>

            <p className="doctor-info"><strong>Doctor Name:</strong> Dr. {details.MTD_DOCTOR}</p>

            <div className="button-container-no-print">
          
                <button onClick={handlePrint} className="print-btn">Print</button>
                <button onClick={downloadInvoice} className="download-btn">Download</button>
                {/* <button onClick={handleViewInvoice} className='Invoice-btn'>Invoice</button> */}
            </div>
        </div>
    );
}
