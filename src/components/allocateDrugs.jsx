import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AllocateDrugs = () => {
  const { patientId, serialNumber } = useParams(); // Extract patient ID and serial number from URL
  const [drugData, setDrugData] = useState({
    MDD_PATIENT_CODE: patientId,
    MDD_SERIAL_NO: serialNumber,
    MDD_MATERIAL_CODE: '',
    MDD_QUANTITY: 0,
    MDD_DOSAGE: '',
    MDD_TAKES: '',
    MDD_STATUS: 'A',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDrugData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7132/api/Drugs', drugData);
      console.log('Drug allocated successfully:', response.data);
      alert("Drugs allocated successfully");
    } catch (error) {
      console.error('Error allocating drugs:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Allocate Drugs for Treatment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="MDD_MATERIAL_CODE">Material Code</label>
        <input
          type="text"
          id="MDD_MATERIAL_CODE"
          value={drugData.MDD_MATERIAL_CODE}
          onChange={handleChange}
          placeholder="Enter material code"
          required
        />

        <label htmlFor="MDD_QUANTITY">Quantity</label>
        <input
          type="number"
          id="MDD_QUANTITY"
          value={drugData.MDD_QUANTITY}
          onChange={handleChange}
          required
        />

        <label htmlFor="MDD_DOSAGE">Dosage</label>
        <input
          type="text"
          id="MDD_DOSAGE"
          value={drugData.MDD_DOSAGE}
          onChange={handleChange}
          placeholder="Enter dosage"
          required
        />

        <label htmlFor="MDD_TAKES">Takes</label>
        <input
          type="text"
          id="MDD_TAKES"
          value={drugData.MDD_TAKES}
          onChange={handleChange}
          placeholder="Enter takes"
          required
        />

        <button type="submit">Allocate Drug</button>
      </form>
    </div>
  );
};

export default AllocateDrugs;
