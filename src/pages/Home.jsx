
//Home.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import '../styles/home.css';
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import PatientAppointment from "../components/patientappoinment";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import doctor_consultation from '../assets/doctor_consultation.webp';
import image from "../assets/feedback.png";
import image2 from '../assets/medical-record.jpg';
import image3 from '../assets/appoinment.avif';
import image4 from '../assets/online-medical.png'
import image5 from '../assets/pharmacy_new.png'
import image6 from '../assets/medical-prescription.png'
import doctor_image from "../assets/doctor_image.jpg";
import doctor4 from '../assets/doctor4.webp';
import doctor3 from '../assets/doctor3.png';






export default function Home() {

  const images = [doctor_consultation, doctor4, doctor3];
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);


  // Automatically move to the next image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);


  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };


  const openup = () => {
    setPopup(true);
  };

  const closeup = () => {
    setPopup(false);
  };

  return (
    <div className="home-container">
      <Navbar />
      <br />

      <div id="home-section" className="section1">


        <div className="containers">


          <div className="left-container1">
            <div className="image-slider-container">
              {/* Left arrow */}
              <div className="arrow left-arrow" onClick={prevImage} style={{ color: "black" }}>
                &#10094;
              </div>

              {/* Image */}
              <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />

              {/* Right arrow */}
              <div className="arrow right-arrow" onClick={nextImage} style={{ color: "black" }}>
                &#10095;
              </div>

              {/* Dots below the image */}
              <div className="dots-container">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-container1">

            {/* <h1>Patient Record Management System</h1> */}


            <p>
              The system is enables the  patient to view  the past medical history and prescriptions of patients.The system provides facility to
              Schedule online appoinments.The user can select available timeslot of the doctor and book an appoinment .



            </p>
            <button onClick={openup}>Book appointment </button>
          </div>













        </div>





      </div>


      {popup && (
        <div className="popup-overlay" onClick={closeup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeup}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <PatientAppointment />
          </div>
        </div>
      )}



      <div className="services-container">
        <h2 style={{ textAlign: 'center' }}>Our Services</h2>


        <div id="services-section" className="services-section">



          <div className="service-card">
            <h3>Online appointments</h3>
            <div className="card-content">
              <p>The system allows patients to book an appoinment for doctor.</p>
              <img src={image4} alt="Online appointments" />
            </div>
          </div>

          <div className="service-card">
            <h3>Keep Medical History</h3>
            <div className="card-content">
              <p>The system keeps the patient's medical history.</p>
              <img src={image6} alt="Medical history" />
            </div>
          </div>

          <div className="service-card">
            <h3>Pharmacy Management</h3>
            <div className="card-content">
              <p>The system allows pharmacy users to track prescriptions.</p>
              <img src={image5} alt="Pharmacy management" />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
