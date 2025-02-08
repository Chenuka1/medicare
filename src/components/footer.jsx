import React from 'react';
import '../styles/footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>© 2023 Medilink Hospitals PLC. All rights reserved.</p>
        </div>

        <div className="footer-center">
          <h2 style={{ fontSize: "16px", color: "white" }}>Follow us</h2>
          <div className="footer-icons">
            <ul>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a></li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <h2>Quick Links</h2>
          <ul>
            {/* <li><a href="/privacy-policy">Privacy policy</a></li> */}
            <li><a href="/dashboard"> Dashboard</a></li>
            <li><a href="/medical-history">Past records</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
