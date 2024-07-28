import "./App.css";
import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import CustomNavbar from './Components/Partial/Navbar';
import ShowAdmins from './Components/Admin/ShowAdmins';
import ShowUsers from './Components/User/ShowUsers';
import AddEvent from './Components/Event/AddEvent';
import CurrentEvent from './Components/Event/CurrentEvents';
import PastEvent from './Components/Event/PastEvents';
import ShowCurrentEvent from './Components/Event/ShowCurrentEvent';
import ShowPastEvent from './Components/Event/ShowPastEvent';
import NotFound404 from './Components/NotFound404'
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the authentication API functions
import { checkAuth } from './API/api';
import VerifyEmail from './Components/VerifyEmail';
import Dashboard from "./Components/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // for OTP
  const [isPartialAuthenticated, setIsPartialAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isAdmin1, setIsAdmin1] = useState(false);
  const [isAdmin2, setIsAdmin2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();

  const fetchAuthStatus = async () => {
    setLoading(true);
    try {
      const list = await checkAuth();
      const isAuthenticated = list[0];
      console.log("IS AUTHENTICATED: ", isAuthenticated);

      const admin1 = (list[1] === 'Admin1' ? true : false);
      const admin2 = (list[1] === 'Admin2' ? true : false);


      setIsAuthenticated(isAuthenticated);
      if (admin1) {
        setIsAdmin1(true);
        setIsAdmin(true);
      }
      else if (admin2) {
        setIsAdmin2(true);
        setIsAdmin(true);
      }
      else {
        setIsAdmin(false);
      }
      setAdminId(list[2]); // set the admin id
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Initial authentication check
    fetchAuthStatus();
  }, [location.pathname],); // Run once on component mount or Run on route change

  if (loading) {
    return (
      <div class="d-flex justify-content-center align-items-center text-center" style={{'height' : '90vh'}}>
        <div class="spinner-border" style={{ 'height': '3rem', 'width': '3rem' }} role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    ); // You can replace this with your loading component
  }

  console.log("Isadmin current status-->", isAdmin);
  console.log("ADMIN ID", adminId);


  return (
    <>
      {/* <Router> */}
      <CustomNavbar isAuthenticated={isAuthenticated} admin1={isAdmin1} admin2={isAdmin2} />
      <Routes>
        <Route path="/" exact={true} element={isAuthenticated ? (!isAdmin ? <Navigate to="/dashboard" /> : <Home adminId={adminId} />) : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? (isAdmin ? <Navigate to="/" /> : <Dashboard userId={adminId} />) : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? <Login setIsPartialAuthenticated={setIsPartialAuthenticated} setUserEmail={setUserEmail} isAdmin={isAdmin} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />} />
        {/* <Route path="/addAdmin" element={(isAuthenticated && isAdmin1) ? <AddAdmin/> : <Login/>} /> */}
        {/* For OTP */}
        <Route path='/verify-email/:isAdmin' element={isPartialAuthenticated ? <VerifyEmail userEmail={userEmail} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/showAdmins" element={(isAuthenticated && isAdmin1) ? <ShowAdmins /> : <Navigate to="/" />} />
        <Route path="/addEvent" element={(isAuthenticated && isAdmin1) ? <AddEvent /> : <Navigate to="/" />} />
        <Route path="/showCurrentEvents" element={(isAuthenticated && isAdmin1) ? <CurrentEvent adminId={adminId} /> : <Navigate to="/" />} />
        <Route path="/showPastEvents" element={(isAuthenticated && isAdmin1) ? <PastEvent adminId={adminId} /> : <Navigate to="/" />} />
        <Route path="/showCurrentEvent/:id" element={(isAuthenticated) ? <ShowCurrentEvent adminId={adminId} /> : <Navigate to="/" />} />
        <Route path="/showPastEvent/:id" element={(isAuthenticated) ? <ShowPastEvent adminId={adminId} /> : <Navigate to="/" />} />
        <Route path="/showUsers" element={(isAuthenticated && isAdmin1) ? <ShowUsers /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {/* </Router> */}
    </>
  );
};

export default App;