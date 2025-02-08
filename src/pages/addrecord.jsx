import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/addrecord.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Addrecord = () => {
  const { patientId } = useParams();
  const Name = localStorage.getItem("Name");
  const location = useLocation();
  const { appoinmentid } = location.state || {}; // Retrieve appoinmentid from the state
  const [medicines, setMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [patientError, setPatientError] = useState('');
  const [patientdetails, setPatientdetails] = useState(null);
  const serialNumber = location.state?.serialNumber || null;
  const [isEditMode, setIsEditMode] = useState(false);
  console.log(serialNumber);//check serial number
  const [prescriptions, setPrescriptions] = useState([
    {
      MDD_MATERIAL_CODE: '',
      MDD_MATERIAL_NAME: '',
      MDD_DOSAGE: '',
      MDD_TAKES: '',
      MDD_TAKES_CUSTOM: '',
      MDD_QUANTITY: '',
      MMC_RATE: 0,
    },
  ]);
  const [activePrescriptionIndex, setActivePrescriptionIndex] = useState(null);

  const [formData, setFormData] = useState({
    MTD_PATIENT_CODE: patientId,
    MTD_DATE: new Date().toISOString(),
    MTD_TYPE: '',
    MTD_DOCTOR: Name || '',
    MTD_TYPE: '',
    MTD_COMPLAIN: '',
    MTD_DIAGNOSTICS: '',
    MTD_REMARKS: '',
    MTD_AMOUNT: '',
    MTD_PAYMENT_STATUS: '',
    MTD_TREATMENT_STATUS: '',
    MTD_SMS_STATUS: '',
    MTD_SMS: '',
    MTD_MEDICAL_STATUS: '',
    MTD_STATUS: '',
    MTD_CREATED_BY: Name || '',
    MTD_CREATED_DATE: new Date().toISOString(),
    MTD_UPDATED_BY: '',
    MTD_UPDATED_DATE: null,
    MTD_APPOINMENT_ID: appoinmentid
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  //function to handle   prescriptionchange
  const handlePrescriptionChange = (index, event) => {
    const { name, value } = event.target;
    const values = [...prescriptions];

    if (name === 'MDD_TAKES') {
      values[index][name] = value;
      // Reset custom field if "Other" is not selected
      if (value !== 'other') {
        values[index].MDD_TAKES_CUSTOM = '';
      }
    } else if (name === 'MDD_TAKES_CUSTOM') {
      values[index][name] = value;
    } else {
      values[index][name] = value;
    }

    setPrescriptions(values);

    // Check if all the current prescription fields are filled
    const isCompleted =
      values[index].MDD_MATERIAL_NAME &&
      values[index].MDD_TAKES &&
      (values[index].MDD_TAKES !== 'other' || values[index].MDD_TAKES_CUSTOM) &&
      values[index].MDD_QUANTITY;

    // If all fields are completed and it's the last prescription, add a new one
    if (isCompleted && index === prescriptions.length - 1) {
      handleAddPrescription();
    }
  };

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      {
        MDD_MATERIAL_CODE: '',
        MDD_MATERIAL_NAME: '',
        MDD_DOSAGE: '',
        MDD_TAKES: '',
        MDD_TAKES_CUSTOM: '', // New field
        MDD_QUANTITY: '',
        MMC_RATE: 0,
       
      },
    ]);
    // setIsEditMode(false);
  };


  const handleAddNewPrescription = () => {
    // Create a new prescription object with default values without modifying the existing prescriptions
    const newPrescription = {
      MDD_MATERIAL_CODE: '',
      MDD_MATERIAL_NAME: '',
      MDD_DOSAGE: '',
      MDD_TAKES: '',
      MDD_TAKES_CUSTOM: '', // New field
      MDD_QUANTITY: '',
      MMC_RATE: 0,
    };

    // Add the new prescription to the existing list without affecting the fetched data
    setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription]);

    // setIsEditMode(false);
  };


  // const handleRemovePrescription = (index) => {
  //   const values = [...prescriptions];
  //   values.splice(index, 1);
  //   setPrescriptions(values);

  //   if(isEditMode){


  //     axios.put(``)
  //   }


    
  // };


  //purpose to update drug status is updat
  const handleRemovePrescription = (index) => {
    const values = [...prescriptions];
    const removedPrescription = values[index]; // Get the prescription being removed
    values.splice(index, 1); // Remove it from the array
    setPrescriptions(values); // Update the state
  
    if (isEditMode) {
      // Extract composite key values
      const { MDD_PATIENT_CODE, MDD_SERIAL_NO, MDD_MATERIAL_CODE } = removedPrescription;
  
      // Make the API call to update the status
      axios
        .put(`${process.env.REACT_APP_API_BASE_URL}/Drug/drugstatusupdate`, null, {
          params: {
            patientCode: MDD_PATIENT_CODE,
            serialNo: MDD_SERIAL_NO,
            materialCode: MDD_MATERIAL_CODE,
          },
        })
        .then((response) => {
          console.log('Medicine status updated to "I":', response.data);
        })
        .catch((error) => {
          console.error('Error updating medicine status:', error);
        });
    }
  };
  

  const handleSearchChange = async (index, event) => {
    const query = event.target.value;
    const values = [...prescriptions];
    values[index].MDD_MATERIAL_NAME = query;
    setPrescriptions(values);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Material/search?query=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMedicine = (index, materialCode, materialName, rate) => {
    const values = [...prescriptions];
    values[index].MDD_MATERIAL_CODE = materialCode;
    values[index].MDD_MATERIAL_NAME = materialName;
    values[index].MMC_RATE = rate;
    setSearchResults([]);
    setPrescriptions(values);
  };

  const [treatmentamout, settreatmentamount] = useState(0);



  useEffect(() => {
    const fetchExistingData = async () => {




      if (serialNumber) {
        setIsEditMode(true); // Enable edit mode


        try {
          // Fetch treatment details
          const treatmentResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Treatment/patientdetail/treatmentdetail/${patientId}/${serialNumber}`
          );
          const treatmentData = treatmentResponse.data;
       



          // Update form data with fetched treatment details
          setFormData((prevData) => ({
            ...prevData,
            ...treatmentData,
          }));

          // Fetch prescriptions
          const prescriptionsResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Drug/${serialNumber}`
          );




          const prescriptionsData = prescriptionsResponse.data;
          console.log(prescriptionsData);

          // Update prescriptions with fetched data
          setPrescriptions(prescriptionsData);

          // if (isEditMode) {
          //   handleAddPrescription(); // Call handleAddPrescription when isEditMode is true
          // }

          if (isEditMode) {
            handleAddNewPrescription(); // Call handleAddNewPrescription  by default when isEditMode is true
          }

          console.log()

          setPatientdetails(treatmentData.patientdetails); // Set patient details if available
        } catch (error) {
          console.error('Error fetching data:', error);
          setPatientError('Unable to load patient details.');
        }
      }
    };

    fetchExistingData();
  }, [serialNumber, patientId, isEditMode]);




  const fetchtreatmentcount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/Gettreatments/${patientId}`);
      const count = response.data.TreatmentCount;
      settreatmentamount(count >= 0 ? count + 1 : 0); // Increment treatment count by 1 and update state
    } catch (error) {
      console.log(error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the prescriptions data
    const preparedPrescriptions = prescriptions.map((prescription) => ({
      ...prescription,
      MDD_TAKES:
        prescription.MDD_TAKES === 'other'
          ? prescription.MDD_TAKES_CUSTOM
          : prescription.MDD_TAKES,
    }));

    try {


      if (isEditMode) {
        try {
          // Prepare the payload for treatment and drugs
          const updatePayload = {
            Treatment: {
              MTD_DOCTOR: formData.MTD_DOCTOR,
              MTD_TYPE: formData.MTD_TYPE,
              MTD_COMPLAIN: formData.MTD_COMPLAIN,
              MTD_DIAGNOSTICS: formData.MTD_DIAGNOSTICS,
              MTD_REMARKS: formData.MTD_REMARKS,
              MTD_AMOUNT: formData.MTD_AMOUNT,
              MTD_TREATMENT_STATUS: formData.MTD_TREATMENT_STATUS,
            },
            Drugs: preparedPrescriptions.map((prescription) => ({
              MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
              MDD_QUANTITY: parseInt(prescription.MDD_QUANTITY )|| 0,
              MDD_RATE: prescription.MMC_RATE || prescription.MDD_RATE,
              // MDD_AMOUNT: prescription.MMC_RATE || (parseFloat(prescription.MDD_RATE) || 0) * (parseInt(prescription.MDD_QUANTITY) || 0),

              MDD_AMOUNT: 
              (parseFloat(prescription.MDD_RATE) || 0) * (parseInt(prescription.MDD_QUANTITY) || 0) || 
              parseFloat(prescription.MMC_RATE) || 0,
            
              MDD_DOSAGE: "",
              MDD_TAKES: prescription.MDD_TAKES,
              MDD_GIVEN_QUANTITY: 0,
              MDD_STATUS: '',
              
            })),
          };


          console.log(updatePayload);
      
          // Make the API call to update treatment and drug details
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/Treatment/updatingtreatment/${patientId}/${serialNumber}`,
            updatePayload
          );
      
          if (response.status === 200) {
            // Success message
            alert("Treatment and drug records updated successfully.");
            window.location.reload();
            
          } else {
            
            alert("Failed to update treatment and drug records.");
          }
        } catch (error) {
          // Error handling
          if (error.response && error.response.data) {
            console.error(`Error: ${error.response.data}`);
          } else {
            alert("An unexpected error occurred. Please try again later.");
            console.error("An unexpected error occurred. Please try again later.");
          }
        }
      }
      else {

        //In here I used 2 api for submit 


        //This api used to submit for treatment table
        const treatmentResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Treatment`,
          formData
        );
        const serial_no = treatmentResponse.data.MTD_SERIAL_NO;

        // Submit the prescriptions data
        if (
          preparedPrescriptions.length > 0 &&
          preparedPrescriptions.some(
            (prescription) => prescription.MDD_MATERIAL_CODE
          )
        ) {
          const drugDetailsPromises = preparedPrescriptions.map((prescription) => {
            if (prescription.MDD_MATERIAL_CODE) {
              //This api used to submit for drug table separately
              return axios.post(`${process.env.REACT_APP_API_BASE_URL}/Drug`, {
                MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
                MDD_DOSAGE: prescription.MDD_DOSAGE,
                MDD_TAKES: prescription.MDD_TAKES, // Use the prepared MDD_TAKES
                MDD_CREATED_BY: formData.MTD_CREATED_BY,
                MDD_CREATED_DATE: new Date().toISOString(),
                MDD_UPDATED_BY: '',
                MDD_UPDATED_DATE: null,
                MDD_PATIENT_CODE: patientId,// patient id  
                MDD_RATE: prescription.MMC_RATE || 0,
                MDD_STATUS: '',
                MDD_SERIAL_NO: serial_no,//serial number
                MDD_QUANTITY: prescription.MDD_QUANTITY || 0,
                MDD_AMOUNT:
                  prescription.MMC_RATE *
                  (prescription.MDD_QUANTITY || 0),
              });
            }
            return null;
          });

          await Promise.all(
            drugDetailsPromises.filter((promise) => promise !== null)
          );
        }

        // Navigate to the view record page
        navigate(`/dashboard/view-record/${patientId}/${serial_no}`);

        // Reset form after submission
        setFormData({
          MTD_PATIENT_CODE: patientId,
          MTD_DATE: new Date().toISOString(),
          MTD_DOCTOR: Name || '',
          MTD_TYPE: '',
          MTD_COMPLAIN: '',
          MTD_DIAGNOSTICS: '',
          MTD_REMARKS: '',
          MTD_AMOUNT: '',
          MTD_PAYMENT_STATUS: '',
          MTD_TREATMENT_STATUS: '',
          MTD_SMS_STATUS: '',
          MTD_SMS: '',
          MTD_MEDICAL_STATUS: '',
          MTD_STATUS: '',
          MTD_CREATED_BY: Name || '',
          MTD_CREATED_DATE: new Date().toISOString(),
          MTD_UPDATED_BY: '',
          MTD_UPDATED_DATE: null,
        });
        setPrescriptions([
          {
            MDD_MATERIAL_CODE: '',
            MDD_MATERIAL_NAME: '',
            MDD_DOSAGE: '',
            MDD_TAKES: '',
            MDD_TAKES_CUSTOM: '', // Reset custom field
            MDD_QUANTITY: '',
            MMC_RATE: 0,
          },
        ]);


      }

   // Submit the treatment data

    } catch (error) {
      console.error(
        'Error submitting record:',
        error.response?.data || error.message
      );
      setModalContent('Error submitting treatment and prescription details.');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="treatment-form-container">

      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>

      </div>
      <h2> {isEditMode?"Edit treatment details" :"Add treatment details"}</h2>
      <p className="subheading">
        Fill in the treatment and prescription information below.
      </p>

      <div className="patient-info">

        {/* <p><strong>Patient name:</strong> {patientdetails ? patientdetails.MPD_PATIENT_NAME : 'Loading'}<br></br></p> */}
        <p>
          {/* <strong>Patient name:</strong> {patientdetails ? patientdetails.MPD_PATIENT_NAME : 'Loading'}<br></br> */}
          {/* <strong>Treatment number: {treatmentamout >= 0 ? treatmentamout : "N/A"}</strong> */}


        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-rowx">
          <div className="form-group-half-width1">
            <label htmlFor="MTD_COMPLAIN">Patient Complaint</label>
            <textarea
              id="MTD_COMPLAIN"
              value={formData.MTD_COMPLAIN}
              onChange={handleFormChange}
              placeholder="Enter patient complaint"
              required
            />
          </div>
        </div>

        <div className="form-rowx">
          <div className="form-group-half-width1">
            <label htmlFor="MTD_DIAGNOSTICS">Diagnosis</label>
            <textarea
              id="MTD_DIAGNOSTICS"
              value={formData.MTD_DIAGNOSTICS}
              onChange={handleFormChange}
              placeholder="Enter patient diagnosis details"
              required
            />
          </div>
        </div>

        <div className="form-groupx">
          <label>Prescriptions</label>
          {prescriptions.map((prescription, index) => (
            <div key={index} className="medicine-group">
              {/* Medicine Name Input and Search */}
              <input
                type="text"
                name="MDD_MATERIAL_NAME"
                placeholder="Search medicines"
                value={prescription.MDD_MATERIAL_NAME}
                onChange={(event) => handleSearchChange(index, event)}
                onFocus={() => setActivePrescriptionIndex(index)}
                disabled={prescription.isFetched}
                required


              />
              <br />
              {activePrescriptionIndex === index && searchResults.length > 0 && (
                <ul className="search-suggestions">
                  {searchResults.map((medicine) => (
                    <li
                      key={medicine.MMC_MATERIAL_CODE}
                      onClick={() =>
                        handleSelectMedicine(
                          index,
                          medicine.MMC_MATERIAL_CODE,
                          medicine.MMC_DESCRIPTION,
                          medicine.MMC_RATE
                        )
                      }
                    >
                      {medicine.MMC_DESCRIPTION}
                    </li>
                  ))}
                </ul>
              )}

              {/* MDD_TAKES Select Dropdown */}
              <select
                name="MDD_TAKES"
                value={prescription.MDD_TAKES}
                onChange={(event) => handlePrescriptionChange(index, event)}
                required
              >
                <option value="not-define">How to Take</option>
                <option value="Daily">Daily</option>
                <option value="Twice a Day before food">Twice a Day before food</option>
                <option value="Three times per day before food">
                  Three times per day before food
                </option>
                <option value="Twice a day after food">Twice a day after food</option>
                <option value="Three times per day after food">Three times per day after food</option>
                <option value="As Needed">As Needed</option>
                <option value="other">Other</option>
              </select>

              {/* Conditional Custom Input for "Other" */}
              {prescription.MDD_TAKES === 'other' && (
                <input
                  type="text"
                  name="MDD_TAKES_CUSTOM"
                  value={prescription.MDD_TAKES_CUSTOM}
                  onChange={(event) => handlePrescriptionChange(index, event)}
                  placeholder="Specify how to take"
                  required
                />
              )}
              {/* Quantity Input */}
              <input
                type="number"
                name="MDD_QUANTITY"
                value={prescription.MDD_QUANTITY}
                onChange={(event) => handlePrescriptionChange(index, event)}
                placeholder="Quantity"
                min="1"
                required
              />

              {/* Remove Button */}
              <button
                type="button"
                className="remove"
                onClick={() => handleRemovePrescription(index)}
              >
                Remove
              </button>
            </div>
          ))}
          {/* <button
            type="button"
            className="Add-prescrib"
            onClick={handleAddPrescription}
          >
            Add drug
          </button> */}
          <br />
        </div>

        <div className="form-rowx">
          <div className="form-group-half-width1">
            <label htmlFor="MTD_REMARKS">Doctor's Remarks</label>
            <textarea
              id="MTD_REMARKS"
              value={formData.MTD_REMARKS}
              onChange={handleFormChange}
              placeholder="Enter doctor remarks for the patient"
              required
            />
          </div>
        </div>

        <div className="form-rowx">
          {/* <div className="form-group-half-width1">
            <label htmlFor="MTD_MEDICAL_STATUS">Medical Condition</label>
            <select
              id="MTD_MEDICAL_STATUS"
              value={formData.MTD_MEDICAL_STATUS}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Medical Condition</option>
              <option value="S">Stable</option>
              <option value="C">Critical</option>
            </select>
          </div> */}

          <div className="form-group-half-width1">
            <label htmlFor="MTD_TREATMENT_STATUS">Treatment Status</label>
            <select
              id="MTD_TREATMENT_STATUS"
              value={formData.MTD_TREATMENT_STATUS}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Treatment Status</option>
              <option value="C">Completed</option>
              <option value="N">Not Completed</option>
              <option value="P">Preparation completed</option>
            </select>
          </div>
          <div className="form-group-half-width1">
            <label htmlFor="MTD_AMOUNT">Treatment Amount</label>
            <input
              type="number"
              id="MTD_AMOUNT"
              name="MTD_AMOUNT"
              value={formData.MTD_AMOUNT}
              onChange={handleFormChange}
              placeholder="Enter treatment amount in number "
              required
              min='1'
            />
          </div>
        </div>
        <button type="submit">{isEditMode ? 'Update treatment' : 'Submit'}</button>
      </form>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>Alert</h2>
        <p>{modalContent}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Addrecord;
