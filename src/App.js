import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login';
import Addtimeslot from './components/addTimeslot';
import Home from './pages/Home';
import Doctordashboard from './components/doctorDashboard';
import Dailyappoinment from './components/dailyappoinment';
import Medicalhistory from './pages/medicalhistory';
import Viewtimeslot from './components/viewTimeslot';
import Registermedicine from './components/registerMedicine';
import Addrecord from './pages/addrecord';
import Addpatient from './components/addPatients';
import AllocateDrugs from './components/allocateDrugs';
import Adduser from './components/adduser';
import ViewRecord from './components/viewRecord';
import Invoice from './components/invoice';
import AvailableTimeslots from './components/availableTimeslot';
import Aboutus from "./pages/aboutus";
import Remarks from "./components/remarks";
import Pharmacy from "./components/pharmacy";
import Pharmacyinvoice from "./components/pharmacyinvoice";
import Userregistration from "./components/userRegistration";
import Pmedicalhistory from "./pages/patientmedicalhistory";
import Patientlogin from "./pages/patientlogin";
import LoginSelector from "./components/loginselector";
import AppoinmentHistory from "./pages/appoinmentHistory";
import PatientAppointment from "./components/patientappoinment";
import Profile from "./pages/profile";
import Doctorprofile from "./components/doctorprofile";
import Patientdetails from "./components/patientDetails";
// import Editrecord from "./components/editrecord";

// Modify the ProtectedRoute to protect public routes as well
const ProtectedRoute = ({ element: Element, roles, ...rest }) => {
  const token = localStorage.getItem("Token");
  const userRole = localStorage.getItem("Role");
  const currentPath = window.location.pathname;

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not allowed, redirect to login
  if (!roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Redirect 'phuser' to register-medicines instead of medical-history
  // if (userRole === "Phuser" && currentPath === "/dashboard/medical-history") {
  //   return <Navigate to="/dashboard/register-medicines" replace />;
  // }

  // Render the component if both token and role are valid
  return <Element {...rest} />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes but protected with 'patient' role */}
          <Route path="/admin" element={<Login />} />
          <Route path="/no" element={<LoginSelector />} />
          <Route path="/home" element={<ProtectedRoute element={Home} roles={['patient']} />} />
          <Route path="/" element={<Patientlogin />} />
          <Route path="/available-time" element={<AvailableTimeslots />} />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/medical-history" element={<ProtectedRoute element={Pmedicalhistory} roles={['patient']} />} />
          <Route path="/appoinment-history" element={<ProtectedRoute element={AppoinmentHistory} roles={['patient']} />} />
          <Route path="/appoinment" element={<ProtectedRoute element={PatientAppointment} roles={['patient']} />} />
          <Route path="/profile" element={<ProtectedRoute element={Profile} roles={['patient']} />} />
          <Route path="/addusers" element={<Userregistration />} />

          {/* Protected Doctor and Admin Dashboard Routes */}
          <Route path="/dashboard/*" element={<ProtectedRoute element={Doctordashboard} roles={['Doc', 'Admin','Phuser']} />}>
            <Route path="" element={<Navigate to="medical-history" />} /> {/* Redirect to medical-history by default */}
            <Route path="medical-history" element={<ProtectedRoute element={Medicalhistory} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="daily-appointments" element={<ProtectedRoute element={Dailyappoinment} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="view-timeslots" element={<ProtectedRoute element={Viewtimeslot} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="register-medicines" element={<ProtectedRoute element={Registermedicine} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="addrecord/:patientId" element={<ProtectedRoute element={Addrecord} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="add-patient" element={<ProtectedRoute element={Addpatient} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="allocate-drugs/:patientId/:serialNumber" element={<ProtectedRoute element={AllocateDrugs} roles={['Doc', 'Admin']} />} />
            <Route path="view-record/:patientId/:serial_no" element={<ProtectedRoute element={ViewRecord} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="add-timeslot" element={<ProtectedRoute element={Addtimeslot} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="invoice/:patientId/:serial_no" element={<ProtectedRoute element={Invoice} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="remark/:patientId/:serial_no" element={<ProtectedRoute element={Remarks} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="pharmacy" element={<ProtectedRoute element={Pharmacy} roles={['Doc', 'Admin', 'Phuser']} />} />
            <Route path="Add-users" element={<ProtectedRoute element={Adduser} roles={['Doc', 'Phuser', 'Admin','Phuser']} />} />
            <Route path="pharmacy-invoice/:patientId/:serial_no" element={<Pharmacyinvoice />} />
            <Route path="daily-appoinments" element={<ProtectedRoute element={Dailyappoinment} roles={['Doc','Admin','Phuser']} />} />
            <Route path="doctor-profile" element={<ProtectedRoute element={Doctorprofile} roles={['Doc', 'Admin','Phuser']} />} />
            <Route path="patientdetails/:patientId" element={<ProtectedRoute element={Patientdetails} roles={['Doc', 'Admin','Phuser']} />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
