
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/patientappoinment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Corrected import
import { faUserMd } from '@fortawesome/free-solid-svg-icons';    // Corrected import

export default function PatientAppointment({ onClose }) {
  const [query, setQuery] = useState("");
  const[userid,setUserid]=useState("");//adding state for the user id
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const[selecteduserid,setSelectedUserid]= useState("");
  const [doctor, setDoctor] = useState("");
  const [specialization, setSpecialization] = useState("OPD");
  const [currentScreen, setCurrentScreen] = useState(0);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [MAD_FULL_NAME, setFullName] = useState("");
  const [MAD_CONTACT, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormeassage, setErrormessage] = useState("");
  const patientid=localStorage.getItem("PatientCode");


 




  useEffect(() => {
    // Check if the user is already logged in by checking localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      setCurrentScreen(1); // Skip the login screen if logged in
    }
  }, []);

  const name = localStorage.getItem('Name');
  const contact = localStorage.getItem('Contact');


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/Login`, {
        email: email,
        password: password,
      });

      console.log(response.data);
      alert("Login successful");

      // Store login status in localStorage
      localStorage.setItem("isLoggedIn", true);

      // Proceed to the next screen
      setCurrentScreen(1);
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };


  // const handleSearch = async (e) => {
  //   const searchValue = e.target.value;
  //   setQuery(searchValue);

  //   if (searchValue.length > 2) {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_BASE_URL}/User/suggest?query=${searchValue}`
  //       );
  //       setSuggestions(response.data);
  //     } catch (error) {
  //       console.error("Error fetching suggestions:", error);
  //       setSuggestions([]);
  //     }
  //   } else {
  //     setSuggestions([]);
  //   }
  // };
  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);
  
    if (searchValue.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/suggest/doctor?query=${searchValue}`
        );
        setSuggestions(response.data); // Assuming response is an array of objects with UserName property
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  

  useEffect(() => {

    //fetch appoinment based on the doctor
    const fetchAppointments = async () => {
      if (userid) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Timeslot/Doctorid/${userid}`);
          setAppointmentDetails(response.data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setAppointmentDetails([]);
        }
      }
    };

    fetchAppointments();
  }, [userid]);

  const handleSuggestionClick = (doctorName,userId) => {
    setSelectedDoctor(doctorName);
    setSelectedUserid(userId);
    setQuery(doctorName);
    setSuggestions([]);
  };
  const handleConfirm = async () => {
   
    try {
      await submitAppointment();
      await handleUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/doctorid/specialization`,
        {
          params: {
            userId: selecteduserid,
            specialization: specialization,
          },
        }
      );

      if (response.data.length > 0) {
        setDoctor(response.data); // Assuming `response.data` is an array of doctor names
        setSelectedDoctor(response.data[0].MUD_USER_NAME); // Set the first doctor from the result as the selected doctor
        // console.log(selectedDoctor);
        setUserid(response.data.MUD_USER_ID);
        console.log(userid);
        setCurrentScreen(2); // Move to the second screen
        setErrormessage(null);

      } else {
        setDoctor([]); // No doctors found

      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error:", error.response.data);
        setErrormessage(error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };


  const handleBackClick = () => {
    setCurrentScreen((prevScreen) => (prevScreen > 0 ? prevScreen - 1 : 0));
  };


  const handleChannelClick = (selectedDoc) => {
    setSelectedDoctor(selectedDoc.MUD_USER_NAME); // Set the selected doctor's name
    setUserid(selectedDoc.MUD_USER_ID); // Set the selected doctor's user ID
    console.log(`Selected Doctor: ${selectedDoc.MUD_USER_NAME}, ID: ${selectedDoc.MUD_USER_ID}`);
    setCurrentScreen(3); // Navigate to screen 3
  }

  const handleBookNowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCurrentScreen(4);
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/Timeslot/${selectedAppointment.MT_SLOT_ID}/incrementSeat`);
    } catch (error) {
      console.error("Failed to update time slot", error.response?.data || error.message);
    }
  };

  const email1 = localStorage.getItem("Email");
  const PatientCode = localStorage.getItem("PatientCode")
  console.log("PatientCode from localStorage:", PatientCode);

  const submitAppointment = async () => {
    try {
      // Check if email is retrieved correctly
      if (!email1) {
        alert("Email not found. Please log in again.");
        return;
      }

      // Validate the selectedAppointment fields before proceeding
      if (!selectedAppointment) {
        alert("No appointment selected. Please choose a time slot.");
        return;
      }

      const appointmentData = {
        MAD_FULL_NAME: name,  // Make sure MAD_FULL_NAME and MAD_CONTACT are defined in the component
        MAD_CONTACT: contact,
        MAD_PATIENT_NO: selectedAppointment.MT_PATIENT_NO + 1,
        MAD_APPOINMENT_DATE: selectedAppointment.MT_SLOT_DATE,
        MAD_START_TIME: selectedAppointment.MT_START_TIME,
        MAD_END_TIME: selectedAppointment.MT_END_TIME,
        MAD_DOCTOR: selectedAppointment.MT_DOCTOR,
        MAD_ALLOCATED_TIME: selectedAppointment.MT_ALLOCATED_TIME,
        MAD_EMAIL: "",  // Use retrieved email from localStorage
        MAD_PATIENT_CODE: PatientCode,
        MAD_SLOT_ID: selectedAppointment.MT_SLOT_ID,
        MAD_USER_ID:selectedAppointment.MT_USER_ID

      };

      // Post the appointment data
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Appointment`, appointmentData);

      // alert("Appointment submitted successfully");
      setCurrentScreen(5); // Navigate to the desired screen after successful submission
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to submit the appointment. Please try again.");
    }
  };



  return (
    <div className="appoinment-screen-container">

      <div className="mobile-frame">



        <div className={`screen login-screen ${currentScreen === 0 ? 'active' : ''}`}>
          <h1>Login</h1>
          <label>Email</label>
          <input
            type="text"
            placeholder="please enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>Don't have an account? <a href="/register-user">Create One</a></p>

        </div>
        {/* <div className={`screen1 ${currentScreen === 1 ? 'active' : ''}`}>
          <h1>Find a doctor and book an appointment</h1>
          <label>Doctor name</label>
          <input
            type="search"
            placeholder="Enter doctor name"
            value={query}
            onChange={handleSearch}
          />
          {suggestions.length > 0 && (
            <ul className="doctor-suggestions">
              {suggestions.map((doctorName, index) => (
                <li key={index} onClick={() => handleSuggestionClick(doctorName)}>
                  {doctorName}
                </li>
              ))}
            </ul>
          )}
          <label>Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="no">search based on specialization</option>
            <option value="psychiatrist">Psychiatrist</option>
            <option value="Dentist">Dentist</option>
            <option value="cardiologist">Cardiologist</option>
            <option value="gynecologist">Gynecologist</option>
            <option value="pediatrician">Pediatrician</option>
            <option value="immunologist">Immunologist</option>
            <option value="general_practitioner">General Practitioner</option>
          </select>
          <p>Search doctor using name or specialization</p>
          <button className="btn-search-appointment" onClick={handleSearchClick}>Search</button>

          
          {errormeassage && (
            <div className="error-message">
              {errormeassage}
            </div>
          )}
        </div> */}
        <div className={`screen1 ${currentScreen === 1 ? 'active' : ''}`}>
  <h1>Find a doctor and book an appointment</h1>
  <label>Doctor name</label>
  <input
    type="search"
    placeholder="Enter doctor name"
    value={query}
    onChange={handleSearch}
  />
  {suggestions.length > 0 && (
    <ul className="doctor-suggestions">
      {suggestions.map((doctor, index) => (
        <li key={index} onClick={() => handleSuggestionClick(doctor.UserName,doctor.UserId)}>
          {doctor.UserName} 
        </li>
      ))}
    </ul>
  )}
  <label>Specialization</label>
  <select
    value={specialization}
    onChange={(e) => setSpecialization(e.target.value)}
  >
    <option value="no">Search based on specialization</option>
    <option value="psychiatrist">Psychiatrist</option>
    <option value="Dentist">Dentist</option>
    <option value="cardiologist">Cardiologist</option>
    <option value="gynecologist">Gynecologist</option>
    <option value="pediatrician">Pediatrician</option>
    <option value="immunologist">Immunologist</option>
    <option value="general_practitioner">General Practitioner</option>
  </select>
  <p>Search doctor using name or specialization</p>
  <button className="btn-search-appointment" onClick={handleSearchClick}>Search</button>

  {/* Display the error message if there is one */}
  {errormeassage && (
    <div className="error-message">
      {errormeassage}
    </div>
  )}
</div>

        <div className={`screen2 ${currentScreen === 2 ? 'active' : ''}`}>
          <button onClick={handleBackClick}>Back</button>
          {doctor.length > 0 ? (
            <ul className="doctor-list">
              {doctor.map((doc, index) => (
                <li key={index} className="doctor-item">
                  <div className="doctor-details">
                    <span>{doc.MUD_USER_NAME}</span>
                    <p>{doc.MUD_SPECIALIZATION}</p>
                  </div>
                  <span className="channel-icon"  onClick={() => handleChannelClick(doc)} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faUserMd} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No doctors available.</p>
          )}

        </div>

        <div className={`screen3 ${currentScreen === 3 ? 'active' : ''}`}>
          <button onClick={handleBackClick} className="back-button">Back</button>
          <div>
            {appointmentDetails.length > 0 ? (
              <ul className="appoinments-lists">
                {appointmentDetails.map((appointment, index) => {
                  const appointmentDate = new Date(appointment.MT_SLOT_DATE);
                  const formattedDate = appointmentDate.toLocaleDateString();
                  const startTime = new Date(`1970-01-01T${appointment.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                    timeZone: 'Asia/Colombo',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  });
                  const endTime = new Date(`1970-01-01T${appointment.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                    timeZone: 'Asia/Colombo',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  });

                  // Convert the end time into a Date object for comparison
                  const endDate = new Date(`${formattedDate} ${endTime}`);
                  const currentTime = new Date();

                  // Check if the appointment date and time has passed
                  const isPastDate = appointmentDate < new Date().setHours(0, 0, 0, 0);
                  const isBookingClosed = currentTime > endDate; // Check if current time exceeds the end time

                  return (
                    <li key={index}>
                      <p>Appointment Date: {appointment.MT_SLOT_DATE.split('T')[0]}</p>
                      <p>Time Duration: {startTime} - {endTime}</p>
                      {isPastDate ? (
                        <p style={{ color: 'red' }}>Sorry, the appointment time has passed.</p>
                      ) : isBookingClosed ? (
                        <p style={{ color: 'red' }}>Bookings are closed for this appointment.</p>
                      ) : appointment.MT_PATIENT_NO >= appointment.MT_MAXIMUM_PATIENTS ? (
                        <p style={{ color: 'red' }}>Bookings are filled</p>
                      ) : (
                        <button onClick={() => handleBookNowClick(appointment)}>Book Now</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No appointments available.</p>
            )}
          </div>
        </div>



        {/* Screen 4: Appointment Confirmation */}
        <div className={`screen4 ${currentScreen === 4 ? 'active' : ''}`}>
          {selectedAppointment && (
            <div className="appointment-card">
              <h2>Appointment details</h2>

              <div className="appointment-details">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Patient Number:</strong> {selectedAppointment.MT_PATIENT_NO + 1}</p>
                <p>
                  <strong>Time:</strong> {new Date(`1970-01-01T${selectedAppointment.MT_ALLOCATED_TIME}`).toLocaleTimeString('en-LK', {
                    timeZone: 'Asia/Colombo',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
                <p><strong>Appointment Date:</strong> {selectedAppointment.MT_SLOT_DATE.split('T')[0]}</p>
                <p>
                  <strong>Doctor Available Time:</strong>{" "}
                  {new Date(`1970-01-01T${selectedAppointment.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                    timeZone: 'Asia/Colombo',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })} -{" "}
                  {new Date(`1970-01-01T${selectedAppointment.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                    timeZone: 'Asia/Colombo',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
              </div>

              <div className="button-group">
                <button className="btn-confirm" onClick={handleConfirm}>confirm</button>
                <button className="btn-back" onClick={handleBackClick}>Back</button>
              </div>
            </div>
          )}
        </div>


        {/* Screen 5: Confirmation Message */}
        <div className={`screen5 ${currentScreen === 5 ? 'active' : ''}`}>
          <h1>Thank you for your booking!</h1>
          <p>Your appointment has been successfully booked.</p>

          {/* <button onClick={handleBackClick} >Back</button> */}
        </div>







      </div>



    </div>
  );
}

