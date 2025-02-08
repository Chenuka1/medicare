import '../styles/login.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import emailjs from "emailjs-com";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [pouperror, setPopuperror] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [stage, setStage] = useState(1); // Initial stage is 1 (email input)
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  const [isPasswordVisible2, setIsPassswordvisible2] = useState(false);

  const [userType, setUserType] = useState('doctor'); // Added state for user type (doctor or pharmacy)

  const navigate = useNavigate();

  const checkuserexists = async (email) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/User/checkuserexists?email=${email}`);
      return response.data;
    }
    catch (error) {
      setPopuperror("The given email is not registered");
      return false;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Login/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage.includes("Invalid username")
          ? "Invalid username. Please check and try again."
          : errorMessage.includes("Invalid password")
            ? "Invalid password. Please check and try again."
            : `Login failed: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Save user token and details
      localStorage.setItem('Token', data.Token);
      localStorage.setItem('Role', data.Role);
      localStorage.setItem('Name', data.Name);
      localStorage.setItem('id', data.id);

      // Handle "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", form.username);// get the username and set it to rememberedUsername state
        localStorage.setItem("rememberedPassword", form.password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      navigate("/dashboard/");
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('Login failed: Unable to connect to the server.');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const sendOTP = async () => {
    const userExists = await checkuserexists(email);
    if (!userExists) return;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    setGeneratedOtp(otpCode);

    const emailParams = {
      user_email: email,
      otp_code: otpCode,
      to_name: email.split('@')[0],
    };

    emailjs
      .send('service_dxxordi', 'template_ia67qxx', emailParams, 'S7S_3J-55UO3MxGEK')
      .then(() => {
        setMessage('OTP sent to your email. please check your email');
        setStage(2);
      })
      .catch(() => setMessage('Failed to send OTP. Try again.'));
  };

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePasswordVisibility2 = () => {
    setIsPassswordvisible2(!isPasswordVisible2)
  }

  const resetPassword = () => {
    // Validate OTP
    if (otp === generatedOtp) {
      // Send the new password to the backend to update
      axios.put(`${process.env.REACT_APP_API_BASE_URL}/User/update-password`, {
        Email: email,
        NewPassword: newPassword
      })
        .then(response => {
          setMessage('Password reset successful!');
          setStage(1); // Go back to stage 1
          // Clear the form
          setEmail('');
          setOtp('');
          setNewPassword('');
        })
        .catch(error => {
          setMessage('Error resetting password: ' + error.response.data);
          console.log(error.response.data);
        });
    } else {
      setMessage('Invalid OTP.');
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedUsername && savedPassword) {
      setForm({ username: savedUsername, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="main-page-container">
      <div className="left-side-container">
        <div className="welcome-message"></div>
      </div>
      <div className="right-side-container">
        <div className="login-form-container">
          {/* Added section for user type selection */}
          {/* <div className="user-type-selection">
            <button
              className={userType === 'doctor' ? 'selected' : ''}
              onClick={() => setUserType('doctor')}
            >
              Doctor
            </button>
            <button
              className={userType === 'pharmacy' ? 'selected' : ''}
              onClick={() => setUserType('pharmacy')}
            >
              Pharmacy
            </button>
          </div> */}

          <form onSubmit={handleSubmit} className="main-form">
            <h1 style={{ textAlign: "center" }}>Welcome Back!</h1>
            <p className="intro-text">Please log in to your account</p>
            <div className="group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="toggle-password-visibility"
                  onClick={handlePasswordVisibility}
                >
                  <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} />
                </span>
              </div>
            </div>

            <div className="options">
              <div className="remember-me-container">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link onClick={() => setShowPopup(true)}>Change password</Link>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </div>

        {showPopup && (
          <div className="popup-overlay5">
            <div className="popu5">
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                X
              </button>
              <h3>Reset Your Password</h3>
              {stage === 1 && (
                <div>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className='b1' onClick={sendOTP}>Send OTP</button>
                  <p>{message}</p>
                </div>
              )}
              {stage === 2 && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button  className="b1" onClick={resetPassword}>Reset Password</button>
                  <p>{message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
