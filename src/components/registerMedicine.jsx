import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/registerMedicines.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"; // Importing icons
import { MdDelete } from "react-icons/md";
import { useRef } from "react"; // Import useRef at the top

export default function Registermedicine() {
    const [form, setForm] = useState({
        MMC_MATERIAL_CODE: "",
        MMC_DESCRIPTION: "",
        MMC_REORDER_LEVEL: "",
        MMC_MATERIAL_SPEC: "",
        MMC_UNIT: "",
        MMC_STATUS: "",
        MMC_CREATED_BY: "",
        MMC_UPDATED_BY: "",
        MMC_RATE: "",
    });

    const [popup, setPopup] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [highlightedRow, setHighlightedRow] = useState(null);
    const rowRefs = useRef({}); // Create a ref to store references to table rows


    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Material`);
                const sortedMedicines = response.data.sort((a, b) => b.isNew - a.isNew); // Sort by isNew flag
                setMedicines(sortedMedicines);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchMedicines();
    }, []);



    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };
// const [Token]=localStorage.getItem("");






    const highlightAndScrollToRow = (materialCode, timeoutDuration = 120000) => {
        setHighlightedRow(materialCode);
        const row = rowRefs.current[materialCode];
        if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        setTimeout(() => {
            setMedicines((prev) =>
                prev.map((medicine) =>
                    medicine.MMC_MATERIAL_CODE === materialCode
                        ? { ...medicine, isNew: false }
                        : medicine
                )
            );
        }, timeoutDuration);
    };






    const refreshMedicines = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Material`);
            setMedicines((prev) =>
                response.data.map((medicine) => ({
                    ...medicine,
                    isNew: prev.some((m) => m.MMC_MATERIAL_CODE === medicine.MMC_MATERIAL_CODE && m.isNew),
                }))
            );
        } catch (error) {
            console.error("Error refreshing medicines:", error);
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const data = {
    //         ...form,
    //         MMC_REORDER_LEVEL: parseFloat(form.MMC_REORDER_LEVEL) || 0,
    //     };

    //     try {
    //         let newMedicine = null;
    //         if (editMode) {
    //             await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/Material/${form.MMC_MATERIAL_CODE}`, data);
    //             alert("Medicine updated successfully");

    //             // Update the existing medicine in the list
    //             newMedicine = { ...form, isNew: true };
    //             setMedicines((prev) =>
    //                 prev.map((medicine) =>
    //                     medicine.MMC_MATERIAL_CODE === newMedicine.MMC_MATERIAL_CODE ? newMedicine : medicine
    //                 )
    //             );
    //         } else {
    //             const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Material`, data);
    //             alert("Medicine registered successfully");

    //             // Add isNew property and prepend the medicine
    //             newMedicine = { ...response.data, isNew: true };
    //             setMedicines((prev) => [newMedicine, ...prev]);
    //         }

    //         // Highlight and scroll to the newly added or updated medicine
    //         highlightAndScrollToRow(newMedicine.MMC_MATERIAL_CODE);

    //         handleReset();
    //         setPopup(false);
    //         setError("");
    //     } catch (error) {
    //         if (error.response && error.response.data && error.response.data.error) {
    //             setError(error.response.data.error);
    //         } else {
    //             setError("An unexpected error occurred. Please try again.");
    //         }
    //         console.error("Error submitting the medicine:", error);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            MMC_REORDER_LEVEL: parseFloat(form.MMC_REORDER_LEVEL) || 0,
        };

        try {
            let newMedicine = null;
            if (editMode) {
                await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/Material/${form.MMC_MATERIAL_CODE}`, data);
                alert("Medicine updated successfully");

                // Update the existing medicine in the list
                newMedicine = { ...form, isNew: true };
                setMedicines((prev) =>
                    prev.map((medicine) =>
                        medicine.MMC_MATERIAL_CODE === newMedicine.MMC_MATERIAL_CODE ? newMedicine : medicine
                    )
                );
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Material`, data);
                alert("Medicine registered successfully");

                // Add isNew property and prepend the medicine
                newMedicine = { ...response.data, isNew: true };
                setMedicines((prev) => [newMedicine, ...prev]);  // Add new medicine at the top
            }

            // Highlight and scroll to the newly added or updated medicine
            highlightAndScrollToRow(newMedicine.MMC_MATERIAL_CODE);

            handleReset();
            setPopup(false);
            setError("");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Error submitting the medicine:", error);
        }
    };


    // Handle delete medicine
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Material/${id}`);
                alert("Medicine deleted successfully");
                refreshMedicines();
            } catch (error) {
                console.error("Error deleting medicine:", error);
            }
        }
    };


    const handleReset = () => {
        setForm({
            MMC_MATERIAL_CODE: "",
            MMC_DESCRIPTION: "",
            MMC_REORDER_LEVEL: "",
            MMC_MATERIAL_SPEC: "",
            MMC_UNIT: "",
            MMC_STATUS: "",
            MMC_CREATED_BY: "",
            MMC_UPDATED_BY: "",
            MMC_RATE: "",
        });
        setEditMode(false);
    };

    // Handle edit button click
    const handleEdit = (medicine) => {
        setForm(medicine);
        setEditMode(true);
        setPopup(true); // Show popup for editing
    };

    // Toggle popup
    const togglePopup = () => {
        setPopup(!popup);
        if (!popup) handleReset(); // Reset form when closing popup
    };

    // Filter medicines based on search term
    const filteredMedicines = medicines.filter(medicine =>
        medicine.MMC_DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="register-medicines-section">
            <h1>Drug Registration</h1>


            <div className="search-add-container">
                <input
                    type="search"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />


                <button onClick={togglePopup} className="add-medicine-btn">
                    {editMode ? "Edit Medicine" : "Add New Medicine"}
                </button>

            </div>

            <div className="drug-table-register">

                <h2>Available Drug Stock</h2>
                <table className="medicine-table">
                    <thead>
                        <tr>
                            <th>Name of Drug</th>
                            <th>Unit</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th >Rate (Rs)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.length > 0 ? (
                            filteredMedicines.map((medicine) => (
                                <tr
                                    key={medicine.MMC_MATERIAL_CODE}
                                    className={medicine.MMC_MATERIAL_CODE === highlightedRow ? 'row-highlight' : ''}  // Highlight new row
                                    ref={(el) => (rowRefs.current[medicine.MMC_MATERIAL_CODE] = el)}
                                >
                                    <td>{medicine.MMC_DESCRIPTION}</td>
                                    <td >{medicine.MMC_UNIT}</td>
                                    <td style={{ textAlign: "right" }}>{medicine.MMC_REORDER_LEVEL}</td>
                                    <td>{medicine.MMC_STATUS}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {medicine.MMC_RATE.toFixed(2)}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(medicine)} className="icon-btn">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(medicine.MMC_MATERIAL_CODE)} className="icon-btn">
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No medicines available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

            {popup && (
                <div className="popup">
                    <div className="popup-content1">
                        <span className="close-btn" onClick={togglePopup}>X</span>
                        <h2>{editMode ? "Edit Medicine" : "Add New Medicine"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="MMC_DESCRIPTION">Name of the drug</label>
                                <input
                                    type="text"
                                    name="MMC_DESCRIPTION"
                                    value={form.MMC_DESCRIPTION}
                                    placeholder="Enter description "
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            
                            <div className="form-group">

                                <labe htmlFor="MMC_UNIT">Unit of medicine</labe>

                                <select
                                    name="MMC_UNIT"
                                    value={form.MMC_UNIT}
                                    onChange={handleChange}>

                                    <option value=""> select unit</option>
                                    <option value="g">Grams</option>
                                    <option value="mg">Milligrams</option>
                                    <option value="ml">Millilitres</option>
                                    <option value="mcg">Micro grams</option>

                                </select>
                            </div>

                            

                            <div className="form-group">
                                <label htmlFor="MMC_REORDER_LEVEL">Quantity</label>
                                <input
                                    type="number" // Changed to number
                                    name="MMC_REORDER_LEVEL"
                                    value={form.MMC_REORDER_LEVEL}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    min="1" // Enforces minimum value of 1
                                    step="0.01" // Allows decimal input
                                    title="Enter a valid quantity (e.g., 1.5)"
                                    pattern="^\d*(\.\d+)?$" // Keeps the regex for additional client-side validation
                                />
                            </div>



                            <div className="form-group">
                                <label htmlFor="MMC_STATUS">Status</label>
                                <select
                                    name="MMC_STATUS"
                                    value={form.MMC_STATUS}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="A">Active</option>
                                    <option value="I">Inactive</option>
                                </select>
                            </div>


                            <div className="form-group">
                                <label htmlFor="MMC_RATE">Rate</label>
                                <input

                                    type="number"
                                    name="MMC_RATE"
                                    value={form.MMC_RATE}
                                    placeholder=" ex:100.00"
                                    onChange={handleChange}
                                    min='1'

                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                {editMode ? "Update Medicine" : "Register Medicine"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
