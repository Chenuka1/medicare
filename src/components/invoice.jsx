import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Invoice.css';
import logo from '../assets/medicare_logo.png';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';


export default function Invoice() {
    const { patientId, serial_no } = useParams();
    const [patients, setPatients] = useState(null);
    const [invoicedetails, setInvoicedetails] = useState(null);
    const [treatmentamount, setTreatmentamount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const location = useLocation();
    const [discountType, setDiscountType] = useState('percentage');
    const navigate = useNavigate("");
    const [medicinedetails, setMedicinedetails] = useState();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`);
                setInvoicedetails(response.data);
                setTreatmentamount(response.data.MTD_AMOUNT || 0);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`);
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchRecords();
        fetchPatientDetails();
    }, [patientId, serial_no]);

    const calculateSubtotal = () => {
        if (invoicedetails && invoicedetails.Drugs) {
            const total = invoicedetails.Drugs.reduce((total, drug) => total + drug.MDD_AMOUNT, 0);
            return total.toFixed(2);
        }
        return 0;
    };

    const calculateTotalAmount = () => {
        const subtotal = parseFloat(calculateSubtotal()) + parseFloat(treatmentamount);
        let totalAmount = subtotal;

        if (discountType === 'percentage') {
            totalAmount -= (subtotal * discount) / 100;
        } else {
            totalAmount -= discount;
        }

        return totalAmount.toFixed(2);
    };

    const printInvoice = () => {
        window.print();
    };

    const downloadInvoice = () => {
        const invoiceElement = document.querySelector('.invoice-container');
        invoiceElement.classList.add('hide-elements');

        const opt = {
            margin: 1,
            filename: `invoice_${patientId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf()
            .from(invoiceElement)
            .set(opt)
            .save()
            .then(() => {
                invoiceElement.classList.remove('hide-elements');
            });
    };

    return (
        <div>




            <div className="invoice-container">

                <button className="back-button" onClick={() => navigate(-1)}>Back</button>




                <header className="header2">
                    <div className="logo-container">
                        <img src={logo} alt="Medilink Logo" className="logo" />
                    </div>
                    <p>85/1, Horana Road, Bandaragama.<br />
                        Tel: 0771068887<br />
                        Email: Medilink@gmail.com<br />
                        Web: www.medilink.lk</p>
                </header>

                <h1>Payment receipt</h1>
                <h3>Medicare hospitals </h3>

                <div className="client-info">
                    <p><strong>Patient Name:</strong> {patients ? patients.MPD_PATIENT_NAME : 'N/A'}</p>
                    <p><strong>Invoice Number:</strong> {invoicedetails ? invoicedetails.MTD_SERIAL_NO : 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date().toISOString().split("T")[0]}</p>
                </div>

                <div className="payment-info">







                    {invoicedetails && invoicedetails.Drugs && invoicedetails.Drugs.length > 0 ? (
                        <div>
                            {/* <h3>Medicine Details</h3> */}
                            <table className="medicine-invoice-table">
                                <thead>
                                    <tr>
                                        <th>Drug Description</th>
                                        <th>Rate (Rs)</th>
                                        <th>Quantity</th>
                                        <th>Amount (Rs) </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoicedetails.Drugs.map((medicinedetail, index) => (
                                        <tr key={index}>
                                            <td>{medicinedetail.DrugName}</td>
                                            <td> {parseFloat(medicinedetail.MDD_RATE).toFixed(2)}</td>
                                            <td>{medicinedetail.MDD_QUANTITY}</td>
                                            <td>{parseFloat(medicinedetail.MDD_AMOUNT).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>

                                {/* Extra rows for totals */}
                                <tr className='total-separator'>
                                    <td colSpan="2"></td> {/* Empty columns */}
                                    <td><strong>Total Drug Fee:</strong></td>
                                    <td><strong>Rs: {calculateSubtotal()}</strong></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td> {/* Empty columns */}
                                    <td><strong>Treatment Fee:</strong></td>
                                    <td><strong>Rs: {treatmentamount.toFixed(2)}</strong></td>
                                </tr>

                                <tr>
                                    <td colSpan="2"></td> {/* Empty columns */}
                                    <td><strong>Total amout:</strong></td>
                                    <td><strong>Rs: {(parseFloat(calculateSubtotal()) + parseFloat(treatmentamount)).toFixed(2)}</strong></td>

                                </tr>


                                <tr className='discount-row'>

                                    <td colSpan={1}></td>
                                    <td><strong>Discount</strong></td>
                                    <td style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="radio"
                                                value="percentage"
                                                checked={discountType === 'percentage'}
                                                onChange={() => setDiscountType('percentage')}
                                            />
                                            Percentage
                                        </label>
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="radio"
                                                value="fixed"
                                                checked={discountType === 'fixed'}
                                                onChange={() => setDiscountType('fixed')}
                                            />
                                            Fixed Amount
                                        </label>
                                    </td>
                                    <td>



                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            min="0"
                                            max={discountType === 'percentage' ? "100" : parseFloat(calculateSubtotal()) + parseFloat(treatmentamount)}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td colSpan="2"></td>

                                    <td><strong>Final amout:</strong></td>
                                    <td><strong> Rs: {calculateTotalAmount()}</strong></td>
                                </tr>
                            </table>
                        </div>
                    ) : (
                        <p>No medicines found</p>
                    )}


                    <div className="">
                        {/* <p><strong>Total Drug Fee:</strong> Rs: {calculateSubtotal()}</p>
                        <p><strong>Treatment Fee:</strong> Rs: {treatmentamount.toFixed(2)}</p> */}
                        {/* <p><strong>Total Amount:</strong> Rs: {parseFloat(calculateSubtotal()) + parseFloat(treatmentamount)}</p> */}

                        {/* <p><strong>Discount:</strong> */}
                        {/* <label>
                                <input
                                    type="radio"
                                    value="percentage"
                                    checked={discountType === 'percentage'}
                                    onChange={() => setDiscountType('percentage')}
                                /> Percentage
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="fixed"
                                    checked={discountType === 'fixed'}
                                    onChange={() => setDiscountType('fixed')}
                                /> Fixed Amount
                            </label>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                min="0"
                                max={discountType === 'percentage' ? "100" : parseFloat(calculateSubtotal()) + parseFloat(treatmentamount)}
                            />
                        </p> */}


                    </div>






                </div>

                <div className="btn-container1">
                    <button className="btn print" onClick={printInvoice}>Print</button>
                    <button className="btn download" onClick={downloadInvoice}>Download</button>

                </div>
            </div>
        </div>
    );
}
