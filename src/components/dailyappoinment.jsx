import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DailyAppoinment.css";
import { useLocation, useNavigate } from 'react-router-dom';
import Addtimeslot from "./addTimeslot";

export default function DailyAppointment() {
    const [timeslots, setTimeslots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
    const [error, setError] = useState(null); // Track errors
    const [appointments, setAppointments] = useState([]); // To store appointments
    const [selectedSlotId, setSelectedSlotId] = useState(null); // Track selected timeslot ID
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const Name = localStorage.getItem("Name");
    const location = useLocation();
    const navigate = useNavigate();


    
    const [error1,setError1]=useState(null);

    // Fetch timeslots based on selected date
    useEffect(() => {
        const fetchTimeslotsByDate = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Timeslot/timeslotcard/${selectedDate}/${Name}`);
                setTimeslots(response.data);
                setError(null); // Clear any previous errors
                setError1(null);
            } catch (error) {
                setTimeslots([]); // Clear timeslots if an error occurs
                setError("No timeslots available for the selected date.");
                console.error("Error fetching timeslots:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch timeslots whenever selectedDate changes
        if (selectedDate) {
            fetchTimeslotsByDate();
        }
    }, [selectedDate]);

    // Fetch appointments based on selected timeslot ID
    const handleViewAppointments = async (slotId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Appointment/appointments/${slotId}`);
            setAppointments(response.data);
            setSelectedSlotId(slotId); // Set the selected slot ID
            setError1(false);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setError1("No appointments available for timeslot");
            setAppointments([]); // Clear appointments if an error occurs
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRecord = (patientId, appoinmentID,patientno) => {
        navigate(`/dashboard/addrecord/${patientId}`, {
            state: { appoinmentid: appoinmentID, channelnumber:patientno }
        });
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value); // Update the date on change
        setAppointments([]); // Clear the appointments when the date changes
        setSelectedSlotId(null); // Reset the selected timeslot ID
    };

    return (
        <div className="daily-appointment-container">
            <h1 className="title">Appointments</h1>

            <div className="date-picker">
                <label htmlFor="date">Select Date: </label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange} // Trigger date change
                />
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p> // Show error message if no timeslots
            ) : (
                <div className="timeslot-cards">
                    {timeslots.map((timeslot) => (
                        <div key={timeslot.MT_SLOT_ID} className="timeslot-card3">
                            <p>Doctor: {timeslot.MT_DOCTOR}</p>
                            <p>Timeslot: {new Date(`1970-01-01T${timeslot.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                                timeZone: 'Asia/Colombo',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })} - {new Date(`1970-01-01T${timeslot.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                                timeZone: 'Asia/Colombo',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })}</p>
                            <button onClick={() => handleViewAppointments(timeslot.MT_SLOT_ID)}>View Appointments</button>
                        </div>
                    ))}
                </div>
            )}

            {selectedSlotId && (
                <div className="appointment-table-container">
                    <h2>Appointments available for this timeslot</h2>

                    {/* <input type="search" placeholder="search using the patient name"/> */}
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Contact</th>
                                <th>Allocated time</th>
                                <th>Patient number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No appointments available for this timeslot</td>
                                </tr>
                            ) : (
                                appointments.map((appointment) => (
                                    <tr key={appointment.MAD_APPOINMENT_ID}>
                                        <td>{appointment.MAD_FULL_NAME}</td>
                                        <td>{appointment.MAD_CONTACT}</td>
                                        <td>{new Date(`1970-01-01T${appointment.MAD_ALLOCATED_TIME}`).toLocaleTimeString('en-LK', {
                                            timeZone: 'Asia/Colombo',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}</td>
                                        <td style={{textAlign:"right"}}>{appointment.MAD_PATIENT_NO}</td>
                                        <td>{appointment.IsCompleted ? (
                                            <span className="completed-label">Completed</span>
                                        ) : (
                                            <button
                                                className="action-button"
                                                onClick={() => handleAddRecord(appointment.MAD_PATIENT_CODE, appointment.MAD_APPOINMENT_ID,appointment.MAD_PATIENT_NO)}
                                            >
                                                Add Treatment details
                                            </button>
                                        )}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>

                    
                </div>
            )}
            <p className="error-message">{error1}</p>
        </div>
    );
}
