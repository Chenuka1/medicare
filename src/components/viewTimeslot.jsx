import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/viewTimeslot.css';

export default function Viewtimeslot() {
    const [timeslots, setTimeslots] = useState([]);

    useEffect(() => {
        const fetchtimeslot = async () => {
            try {
                const response = await axios.get('https://localhost:7132/api/Timeslot');
                setTimeslots(response.data);
            } catch (error) {
                console.error("Error fetching timeslots:", error);
            }
        };

        fetchtimeslot();
    }, []);

    const deleteTimeslot = async (id) => {
        try {
            await axios.delete(`https://localhost:7132/api/Timeslot/${id}`);
            setTimeslots(timeslots.filter(timeslot => timeslot.slot_id !== id));
        } catch (error) {
            console.error("Error deleting timeslot:", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    return (
        <div className="view-timeslot">
            <h1 className="title">Available Timeslots</h1>
            <div className="timeslot-grid">
                {timeslots.length > 0 ? (
                    timeslots.map((timeslot, index) => (
                        <div key={index} className="timeslot-card">
                            <div className="timeslot-details">
                                <p><strong>Date:</strong> {formatDate(timeslot.mt_slot_date)}</p>
                                <p><strong>Start Time:</strong> {timeslot.mt_start_time}</p>
                                <p><strong>End Time:</strong> {timeslot.mt_end_time}</p>
                            </div>
                            <button className="delete-button" onClick={() => deleteTimeslot(timeslot.slot_id)}>
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-timeslots">No available timeslots</p>
                )}
            </div>
        </div>
    );
}
