import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/addtimeslot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Addtimeslot = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    MT_SLOT_DATE: '',
    MT_TIMESLOT: '',
    MT_START_TIME: '',
    MT_PATIENT_NO: 0,
    MT_END_TIME: '',
    MT_MAXIMUM_PATIENTS: '',
    MT_DOCTOR: '',
    MT_ALLOCATED_TIME: '',
    MT_USER_ID:"",
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [timeslotData, setTimeslotData] = useState([]);
  const [validDoctorNames, setValidDoctorNames] = useState([]); // To store valid doctor names


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  

  const handleSuggestionClick = (doctor) => {
    setSelectedDoctor(doctor.UserName); // Use the username
    setQuery(doctor.UserName); // Display the username in the input
    setFormData((prevFormData) => ({
      ...prevFormData,
      MT_DOCTOR: doctor.UserName,
      MT_USER_ID: doctor.UserId // Store the user ID in the form data
    }));
    setSuggestions([]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if doctor is selected from suggestions
    const isValidDoctor = validDoctorNames.some(
      (doctor) => doctor.UserName === formData.MT_DOCTOR
    );
  
    if (!isValidDoctor) {
      setErrorMessage("Please select a doctor from the suggestions.");
      return;
    }
  
    const adjustedFormData = {
      ...formData,
      MT_TIMESLOT: formData.MT_TIMESLOT + ":00",
      MT_START_TIME: formData.MT_START_TIME + ":00",
      MT_END_TIME: formData.MT_END_TIME + ":00",
      MT_ALLOCATED_TIME: formData.MT_START_TIME + ":00",
    };
  
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Timeslot`, adjustedFormData);
      alert('Timeslot added successfully!');
      // Clear the form data after successful submission
      setFormData({
        MT_SLOT_DATE: '',
        MT_TIMESLOT: '',
        MT_START_TIME: '',
        MT_PATIENT_NO: 0,
        MT_END_TIME: '',
        MT_MAXIMUM_PATIENTS: '',
        MT_DOCTOR: '',
        MT_ALLOCATED_TIME: '',
        MT_USER_ID: ''
      });
      setQuery('');
      fetchTimeslots(); // Fetch timeslots again without reloading the page
    } catch (error) {
      console.error("Failed to add timeslot", error.response?.data || error.message);
      setErrorMessage('Failed to add timeslot.');
    }
  };
  


  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/suggest?query=${searchValue}`
        );
        if (response.data.length === 0) {
          setSuggestions([]);
          setErrorMessage("No doctor registered with this name.");
          setValidDoctorNames([]); // Clear valid doctor names
        } else {
          setSuggestions(response.data);
          setValidDoctorNames(response.data); // Store valid doctor names
          setErrorMessage(""); // Clear previous error
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setValidDoctorNames([]); // Clear valid doctor names
        setErrorMessage("Error fetching doctor suggestions.");
      }
    } else {
      setSuggestions([]);
      setValidDoctorNames([]); // Clear valid doctor names
      setErrorMessage(""); // Clear error when input is too short
    }
  };

  const fetchTimeslots = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Timeslot`);
      // Reverse the timeslot data so that the latest comes first
      const reversedTimeslots = response.data.reverse();
      setTimeslotData(reversedTimeslots);
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      setErrorMessage('Failed to load timeslots. Please try again later.');
    }
  };


  const Deletetime = async (id) => {
    if (window.confirm("Are you sure you want to delete this timeslot?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Timeslot/${id}`);
        alert("Timeslot deleted successfully");
        // Update timeslot data after deletion
        setTimeslotData(timeslotData.filter((timeslot) => timeslot.MT_SLOT_ID !== id));
      } catch (error) {
        console.error("Error deleting timeslot:", error.response?.data || error.message);
        alert("Failed to delete timeslot.");
      }
    }
  };

  useEffect(() => {
    fetchTimeslots();
    const interval = setInterval(() => {
      fetchTimeslots();
    }, 60000); // Fetch every 60 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div>
      <div className="addtimeslot-container">
        <h1>Add Available Timeslot</h1>
        <form className="form-timeslot" onSubmit={handleSubmit}>
          <div className="form-group-timeslot">
            <label>Date</label>
            <input
              type="date"
              name="MT_SLOT_DATE"
              value={formData.MT_SLOT_DATE}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>Start Time</label>
            <input
              type="time"
              name="MT_START_TIME"
              value={formData.MT_START_TIME}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>End Time</label>
            <input
              type="time"
              name="MT_END_TIME"
              value={formData.MT_END_TIME}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>Maximum Patients</label>
            <input
              type="number"
              name="MT_MAXIMUM_PATIENTS"
              value={formData.MT_MAXIMUM_PATIENTS}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group-timeslot">
            <label>Doctor</label>
            <input
              type="search"
              placeholder="search doctor by username "
              value={query}
              onChange={handleSearch}
              required
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {/* {suggestions.length > 0 ? (
              <ul className="doctor-suggestions">
                {suggestions.map((doctorName, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(doctorName)}>
                    {doctorName}
                  </li>
                ))}
              </ul>
            ) : (
              query.length > 2 && !errorMessage && <p className="no-doctors"></p>
            )} */}

            {suggestions.length > 0 ? (
              <ul className="doctor-suggestions">
                {suggestions.map((doctor, index) => (
                  <li
                    key={doctor.UserId} // Use UserId as the unique key internally
                    onClick={() => handleSuggestionClick(doctor)} // Pass the entire doctor object
                  >
                    {doctor.UserName} {/* Display only the name */}
                  </li>
                ))}
              </ul>
            ) : (
              query.length > 2 && !errorMessage && <p className="no-doctors"></p>
            )}

          </div>

          <button className="submit-button" type="submit">Add Timeslot</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        <div className="view-timeslot">
          {timeslotData.length > 0 ? (
            <div className="timeslot-container">
              {timeslotData.map((timeslot) => (
                <div key={timeslot.MT_SLOT_ID} className="timeslot-card">
                  <button className="delete-btn2" onClick={() => Deletetime(timeslot.MT_SLOT_ID)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <div className="timeslot-time">
                    

                    {/* <p>Treatment-date: {new Date(treatment.MTD_CREATED_DATE).toISOString().split("T")[0]}</p> */}
                    <p><strong>Date:</strong> {timeslot.MT_SLOT_DATE.split('T')[0]}</p>

                    
                    <p><strong>Time:</strong>
                      {new Date(`1970-01-01T${timeslot.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                        timeZone: 'Asia/Colombo',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                      -
                      {new Date(`1970-01-01T${timeslot.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                        timeZone: 'Asia/Colombo',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </p>
                    <p><strong>Doctor Name:</strong> {timeslot.MT_DOCTOR}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No available timeslots</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addtimeslot;
