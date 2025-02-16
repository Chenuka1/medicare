import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/pharmacy.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaClinicMedical } from "react-icons/fa"; // Import the desired icon

export default function Pharmacy() {
  const [pharmacypatients, setPharmacypatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [treatments, setTreatment] = useState(null);
  const [popup, setPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [totaldrugfee, setTotaldrugfee] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPharmacyPatients = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Treatment/preparationcomplete`
        );
        setPharmacypatients(response.data);
      } catch (error) {
        console.error("Error fetching pharmacy patients:", error);
      }
    };

    fetchPharmacyPatients();

    const intervalId = setInterval(fetchPharmacyPatients, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchTreatmentDetails = async (patientId, serialNo) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serialNo}`
      );
      setTreatment(response.data);
      setSelectedMedicines([]); // Reset selected medicines when new patient is selected
      setTotaldrugfee(0); // Reset the total fee
    } catch (error) {
      console.error("Error fetching the treatments", error);
    }
  };

  const popupOpen = (patient) => {
    setSelectedPatient(patient);
    fetchTreatmentDetails(patient.MPD_PATIENT_CODE, patient.MTD_SERIAL_NO);
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
    setSelectedPatient(null);
    setTreatment(null);
    setSelectedMedicines([]);
    setTotaldrugfee(0);
  };

  const handleSaveAndProceed = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`
      );
      
      navigate(
        `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
        {
          state: { selectedMedicines, totaldrugfee },
        }
      );
    } catch (error) {
      console.error("Error updating treatment status:", error);
      // Handle error (e.g., show a notification)
    }
  };

  const filteredPatients = pharmacypatients.filter((patient) =>
    patient.MPD_MOBILE_NO.includes(searchTerm) || patient.MPD_PATIENT_NAME.includes(searchTerm)
  );

  const calculateTotalDrugFee = (medicines) => {
    const totalFee = medicines.reduce(
      (total, drug) => total + drug.MDD_QUANTITY * drug.MDD_RATE,
      0
    );
    setTotaldrugfee(totalFee);
  };

  const handleDrugSelection = (drugIndex, event) => {
    const updatedMedicines = [...selectedMedicines];
    
    if (event.target.checked) {
      updatedMedicines.push(treatments.Drugs[drugIndex]);
    } else {
      const index = updatedMedicines.findIndex(
        (drug) => drug.DrugName === treatments.Drugs[drugIndex].DrugName
      );
      if (index > -1) {
        updatedMedicines.splice(index, 1);
      }
    }

    setSelectedMedicines(updatedMedicines);
    calculateTotalDrugFee(updatedMedicines);
  };

  const handleQuantityChange = (drugIndex, newQuantity) => {
    const updatedMedicines = [...selectedMedicines];
    const selectedDrug = treatments.Drugs[drugIndex];
    
    // Update the quantity
    selectedDrug.MDD_QUANTITY = newQuantity;

    // Update the list of selected medicines
    const selectedDrugIndex = updatedMedicines.findIndex(
      (drug) => drug.DrugName === selectedDrug.DrugName
    );
    if (selectedDrugIndex !== -1) {
      updatedMedicines[selectedDrugIndex] = selectedDrug;
    }

    setSelectedMedicines(updatedMedicines);
    calculateTotalDrugFee(updatedMedicines); // Recalculate fee after quantity update
  };

  return (
    <div className="pharmacy-container">
      {/* Add Icon and Heading */}
      <div className="heading-container">
        <FaClinicMedical className="heading-icon" size={65} />
        <h1>Allocated Patients</h1>
      </div>

      <input
        type="search"
        placeholder="Search patient by name or contact..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="pharmacy-table-container">
        {filteredPatients.length > 0 ? (
          <table className="pharmacy-table">
            <thead>
              <tr>
                <th>Patient Code</th>
                <th>Patient Name</th>
                <th>Mobile Number</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr key={index}>
                  <td>{patient.MPD_PATIENT_CODE}</td>
                  <td>{patient.MPD_PATIENT_NAME}</td>
                  <td>{patient.MPD_MOBILE_NO}</td>
                  <td>{patient.MTD_TREATMENT_STATUS === "P" ? "Preparation Complete" : patient.MTD_TREATMENT_STATUS}</td>
                  <td>
                    <button onClick={() => popupOpen(patient)} className="view-btn">
                      Medicines
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-patients">
            <p>No pharmacy patients found.</p>
          </div>
        )}
      </div>

      {popup && selectedPatient && treatments && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Treatment Details</h2>
            <p><strong>Patient Name:</strong> {selectedPatient.MPD_PATIENT_NAME}</p>
            <p><strong>Prescribed Doctor:</strong> {treatments.MTD_DOCTOR}</p>
            <h3>Medications</h3>
            <div className="drug-container">
              {treatments.Drugs && treatments.Drugs.length > 0 ? (
                <table className="drug-table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Drug Name</th>
                      <th>Takes</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.Drugs.map((drug, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            onChange={(event) => handleDrugSelection(index, event)}
                          />
                        </td>
                        <td>{drug.DrugName}</td>
                        <td>{drug.MDD_TAKES}</td>
                        <td>
                          <input
                            type="number"
                            value={drug.MDD_QUANTITY}
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                          />
                        </td>
                        <td>{drug.MDD_RATE}</td>
                        <td>{(drug.MDD_QUANTITY * drug.MDD_RATE).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No drugs prescribed.</p>
              )}
            </div>
            <p><strong>Total drug fee:</strong> Rs. {totaldrugfee.toFixed(2)}</p>
            <div className="popup-buttons">
              <button onClick={closePopup} className="close-btn">X</button>
              <button onClick={handleSaveAndProceed} className="save-btn">Save & Proceed to Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
