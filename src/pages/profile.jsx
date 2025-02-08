import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../styles/profile.css';

export default function Profile() {
  const [userAppointments, setUserAppointments] = useState([]);
  const email1 = localStorage.getItem("Email");
  const [profiledata, setProfiledata] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emailerror, setEmailerror] = useState("");
  const [mobilerror, setMobilerror] = useState("");
  const [nicerror, setNicerror] = useState("");
  const patientid = localStorage.getItem("PatientCode");


  const navigate = useNavigate(); // Initialize useNavigate
  console.log(patientid);
  const fetchAppointmentDetails = async () => {
    if (email1) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Appointment/getappointment/patientcode?patientcode=${patientid}`
        );
        setUserAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    } else {
      console.warn("No email found in localStorage");
    }
  };

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Patient/patient/findbyid?patientcode=${patientid}`
      );
      setProfiledata(response.data);
      setUpdatedProfile(response.data);

      if (response.data.MPD_PHOTO) {
        setImagePreview(`data:image/jpeg;base64,${response.data.MPD_PHOTO}`);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state
    setUpdatedProfile({ ...updatedProfile, [name]: value });

    // Real-time validation
    if (name === "MPD_EMAIL") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailerror("Please enter a valid email address.");
      } else {
        setEmailerror("");
      }
    }

    if (name === "MPD_MOBILE_NO") {
      const mobileRegex = /^\d{10}$/; // Example for a 10-digit mobile number
      if (!mobileRegex.test(value)) {
        setMobilerror("Please enter a valid 10-digit mobile number.");
      } else {
        setMobilerror("");
      }
    }

    if (name === "MPD_NIC_NO") {
      if (value.length !== 10 && value.length !== 12) {
        setNicerror("NIC must be 10 or 12 characters long.");

      } else {
        setNicerror("");
      }
    }

  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();


    if (emailerror || mobilerror || nicerror) {

      alert("please correct the errors befor updating the profile");
      return;
    }

    const formData = new FormData();
    Object.keys(updatedProfile).forEach(key => {
      if (updatedProfile[key] !== null) {
        formData.append(key, updatedProfile[key]);
      }
    });

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/Patient/${updatedProfile.MPD_PATIENT_CODE}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfiledata(updatedProfile);
      alert("Profile details updated");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();
    fetchProfileDetails();
  }, [email1]);

  return (
    <div className="profile-body">
      <div className="profile-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>

        <section className="profile-details">
          <h2 className="section-title">Profile</h2>
          <form onSubmit={handleSave}>
            <div className="profile-icon-wrapper">
              <label htmlFor="profileImageUpload" className="profile-image-label">
                <img
                  src={imagePreview || 'default-profile-icon.png'}
                  alt="Profile"
                  className="profile-icon"
                />
              </label>
              <input
                id="profileImageUpload"
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="profile-input-group">
              <label htmlFor="MPD_EMAIL">Email</label>
              <input
                type="text"
                name="MPD_EMAIL"
                id="MPD_EMAIL"
                value={updatedProfile?.MPD_EMAIL || 'Email not available'}
                onChange={handleInputChange}
              />
              {emailerror && <p className="error-message">{emailerror}</p>}
            </div>

            <div className="profile-input-group">
              <label htmlFor="MPD_PATIENT_NAME">Name</label>
              <input
                type="text"
                name="MPD_PATIENT_NAME"
                id="MPD_PATIENT_NAME"
                value={updatedProfile?.MPD_PATIENT_NAME || 'Name not available'}
                onChange={handleInputChange}
              />
            </div>

            <div className="profile-input-group">
              <label htmlFor="MPD_MOBILE_NO">Mobile Number</label>
              <input
                type="text"
                name="MPD_MOBILE_NO"
                id="MPD_MOBILE_NO"
                value={updatedProfile?.MPD_MOBILE_NO || 'Mobile number not available'}
                onChange={handleInputChange}
              />
              {mobilerror && <p className="error-message">{mobilerror}</p>}
            </div>

            <div className="profile-input-group">
              <label htmlFor="MPD_ADDRESS">Address</label>
              <input
                type="text"
                name="MPD_ADDRESS"
                id="MPD_ADDRESS"
                value={updatedProfile?.MPD_ADDRESS || 'Address not available'}
                onChange={handleInputChange}
              />
            </div>

            <div className="profile-input-group">
              <label htmlFor="MPD_NIC_NO">NIC</label>
              <input
                type="text"
                name="MPD_NIC_NO"
                id="MPD_NIC_NO"
                value={updatedProfile?.MPD_NIC_NO || 'NIC not available'}
                onChange={handleInputChange}
              />

              {nicerror && <p className="error-message">{nicerror}</p>}
            </div>

            <div className="button-group">
              {isEditing ? (
                <button type="submit" className="save-button">Save Profile</button>
              ) : (
                <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
                  Update Profile
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="user-appointments">
          <h2 className="section-title">Your Appointments</h2>

          <div className="user-appoiment-table">

            {userAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Doctor</th>

                    <th>Date</th>
                    <th>Doctor available time</th>
                    <th>Your time</th>
                    <th>status</th>

                  </tr>
                </thead>
                <tbody>
                  {userAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>Dr {appointment.MAD_DOCTOR}</td>

                      <td style={{textAlign:"center"}}>{new Date(appointment.MAD_APPOINMENT_DATE).toISOString().split("T")[0]}</td>
                      <td>
                        {new Date(`1970-01-01T${appointment.MAD_START_TIME}`).toLocaleTimeString('en-LK', {
                          timeZone: 'Asia/Colombo',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                        -
                        {new Date(`1970-01-01T${appointment.MAD_END_TIME}`).toLocaleTimeString('en-LK', {
                          timeZone: 'Asia/Colombo',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </td>

                      <td>{new Date(`1970-01-01T${appointment.MAD_ALLOCATED_TIME}`).toLocaleTimeString('en-LK', {
                        timeZone: 'Asia/Colombo',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}</td>


                      <td style={{
                        backgroundColor: appointment.TreatmentStatus === "Completed" ? "green" : "#FF474D",
                        color: "white",
                      }}>{appointment.TreatmentStatus}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No appointments found.</p>
            )}


          </div>

        </section>
      </div>
    </div>
  );
}
