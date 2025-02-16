import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/addUser.css';
import { MdDelete } from "react-icons/md";
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title); // Register required chart components

const Adduser = () => {
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const Name = localStorage.getItem("Name");
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [users, setUsers] = useState([]);

  const [uerror, setUerror] = useState('');//error state to display the username already exists

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/User`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate email format
    if (name === "MUD_EMAIL") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid email address.");
      } else {
        setError(''); // Clear error if email is valid
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const [formData, setFormData] = useState({
    MUD_USER_NAME: '',
    MUD_PASSWORD: '',
    MUD_USER_TYPE: 'Doc',
    MUD_STATUS: 'A',
    MUD_CREATED_DATE: new Date().toISOString(),
    MUD_UPDATE_DATE: new Date().toISOString(),
    MUD_USER_ID: '',
    MUD_UPDATED_BY: '',
    MUD_CREATED_BY: '',
    MUD_SPECIALIZATION: '',
    MUD_EMAIL: '',
    MUD_FULL_NAME: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.MUD_EMAIL)) {
      setError('Please enter a valid email address.');
      return;
    }


    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/User`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('User registered successfully');
      setUsers([...users, response.data]); // Dynamically update the user list
      setFormData({
        MUD_USER_NAME: '',
        MUD_PASSWORD: '',
        MUD_USER_TYPE: 'Doc',
        MUD_STATUS: 'A',
        MUD_CREATED_DATE: new Date().toISOString(),
        MUD_UPDATE_DATE: new Date().toISOString(),
        MUD_USER_ID: '',
        MUD_UPDATED_BY: Name,
        MUD_CREATED_BY: '',
        MUD_SPECIALIZATION: '',
        MUD_FULL_NAME: "",
        MUD_EMAIL: ''
      });
      setPopup(false);
      setError('');
    } catch (error) {
      if (error.response?.data?.error === 'Email already exists.') {
        setError('This email is already registered. Please use a different email.');
      } else if (error.response?.data?.error === 'Username already exists.') {
        setUerror('Username already exists.');

      }

      else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError('An unexpected error occurred.');
      }
    }

  };

  const Deleteuser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/User/${id}`);
        alert("User deleted successfully");
        setUsers(users.filter(user => user.MUD_USER_ID !== id)); // Update users state
      } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
        alert("Failed to delete user.");
      }
    }
  };

  const mapUserCategory = (userType) => {
    switch (userType) {
      case 'Doc':
        return 'Doctor';
      case 'Phuser':
        return 'Pharmacy User';
      case 'Admin':
        return 'Administrator';
      case 'staff':
        return 'Staff';
      default:
        return userType;
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.MUD_FULL_NAME.toLowerCase().includes(searchQuery.toLowerCase()) || user.MUD_USER_NAME.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for the chart
  const userCounts = filteredUsers.reduce((acc, user) => {
    const category = mapUserCategory(user.MUD_USER_TYPE);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(userCounts),
    datasets: [
      {
        label: 'Number of Users',
        data: Object.values(userCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className='add-user-container'>
      <h2>Healthcare providers</h2>
      <div className="search-container1">
        <input
          type="text"
          placeholder="Search users by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setPopup(true)} className="open-popup-btn">Add User</button>
      </div>



      <div className='user-table-container'>


        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User name</th>
              <th> Email</th>
              <th>User Category</th>
              <th>Name</th>
              <th>Specialization</th>

              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.MUD_USER_ID}>
                <td>{user.MUD_USER_ID || 'Not valid'}</td>
                <td>{user.MUD_USER_NAME || 'Not valid'}</td>
                <td>{user.MUD_EMAIL || 'Not valid'}</td>
                <td>{mapUserCategory(user.MUD_USER_TYPE) || 'Not valid'}</td>
                <td>{user.MUD_FULL_NAME}</td>
                <td>{user.MUD_SPECIALIZATION || 'Not valid'}</td>
                <td>
                  <button className='btn-delete' onClick={() => Deleteuser(user.MUD_USER_ID)}>
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      {popup && (
        <div className="popup-container">
          <div className='popup-content4'>
            <button className="close-popup-btn" onClick={() => setPopup(false)}>X</button>
            <h1 className="register-header">Add a New User</h1>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  name="MUD_USER_NAME"
                  value={formData.MUD_USER_NAME}
                  onChange={handleChange}
                  required
                />

                {uerror && <p className='error-message1'>{uerror}</p>}
              </div>

              

              <div className='input-group'>
                <label>Email</label>

                <input

                  type="email"
                  placeholder='enter email'
                  name="MUD_EMAIL"
                  value={formData.MUD_EMAIL}
                  onChange={handleChange}
                  required
                />
                {error && <p className="error-message1">{error}</p>}
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  name="MUD_PASSWORD"
                  value={formData.MUD_PASSWORD}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='input-group'>
                <label>Name</label>
                <input

                  type="text"
                  placeholder='Enter your  name'
                  name="MUD_FULL_NAME"
                  value={formData.MUD_FULL_NAME}
                  onChange={handleChange} 
                  required

                />



              </div>




              <div className="input-group">
                <label>User Type</label>
                <select
                  name="MUD_USER_TYPE"
                  value={formData.MUD_USER_TYPE}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Admin">Admin</option>
                  <option value="Doc">Doctor</option>
                  <option value="staff">Staff</option>
                  <option value="Phuser">Pharmacy user</option>
                </select>
              </div>
              <div className="input-group">
                <label>Specialization</label>
                <select

                  name="MUD_SPECIALIZATION"
                  value={formData.MUD_SPECIALIZATION}
                  onChange={handleChange}
                >
                  <option>Select specializaton for doctors only</option>

                  <option value="psychiatrist">Psychiatrist</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="neurologist">Neurologist</option>
                  <option value="gynecologist">Gynecologist</option>
                  <option value="pediatrician">Pediatrician</option>
                  <option value="immunologist">Immunologist</option>
                  <option value="general_practitioner">General Practitioner</option>
                </select>
              </div>
              <button type="submit" className="register-btn">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adduser;
