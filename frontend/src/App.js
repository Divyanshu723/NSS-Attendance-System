import "./App.css";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

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


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // for OTP
  const [isPartialAuthenticated, setIsPartialAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const[isAdmin1, setIsAdmin1] = useState(false);
  const[isAdmin2, setIsAdmin2] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchAuthStatus = async () => {
    try {
      const list = await checkAuth();
      console.log("List : ", list);
    const isAuthenticated = list[0];

    const admin1 = (list[1] === 'Admin1' ? true : false);
    const admin2 = (list[1] === 'Admin2' ? true : false);

    setIsAuthenticated(isAuthenticated);
    if(admin1){
      setIsAdmin1(true);
    }
    else if(admin2){
      setIsAdmin2(true);
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
  } finally {
    setLoading(false);
  }
  };
  

  useEffect(() => {
    // Initial authentication check
    fetchAuthStatus();
  }, []); // Run once on component mount

  useEffect(() => {
    // Authentication check on every route change
    fetchAuthStatus();
  }, [location.pathname]); // Run on route change

  if (loading) {
    return <p>Loading...</p>; // You can replace this with your loading component
  }


  return (
    <>
    {/* <Router> */}
      <CustomNavbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" exact={true} element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsPartialAuthenticated={setIsPartialAuthenticated} setUserEmail={setUserEmail} />} />
        {/* <Route path="/addAdmin" element={(isAuthenticated && isAdmin1) ? <AddAdmin/> : <Login/>} /> */}
        {/* For OTP */}
        <Route path='/verify-email' element={isPartialAuthenticated ? <VerifyEmail userEmail={userEmail} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" /> } />
        <Route path="/showAdmins" element={(isAuthenticated && isAdmin1) ? <ShowAdmins /> : <Navigate to="/login" />} />
        <Route path="/addEvent" element={(isAuthenticated && isAdmin1) ? <AddEvent /> : <Navigate to="/login" />} />
        <Route path="/showCurrentEvents" element={(isAuthenticated && isAdmin1) ? <CurrentEvent /> : <Navigate to="/login" />} />
        <Route path="/showPastEvents" element={(isAuthenticated && isAdmin1) ? <PastEvent /> : <Navigate to="/login" />} />
        <Route path="/showCurrentEvent/:id" element={(isAuthenticated) ? <ShowCurrentEvent /> : <Navigate to="/login" />} />
        <Route path="/showPastEvent/:id" element={(isAuthenticated) ? <ShowPastEvent /> : <Navigate to="/login" />} />
        <Route path="/showUsers" element={(isAuthenticated && isAdmin1) ? <ShowUsers /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    {/* </Router> */}
    </>
  );
};

export default App;