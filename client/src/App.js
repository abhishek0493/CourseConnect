import Signup from './pages/signup/Signup';
import SignupNew from './pages/signup/SignupNew';
import Home from './pages/home/home';
import Navbar from './components/navbar/navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Consent from './pages/consent/consent';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './pages/dashboard/dashboard';

function App() {
  const [userTypes, setUserTypes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const fetchUserTypes = () => {
    axios
      .get('http://localhost:8000/api/v1/users/categories')
      .then((response) => {
        // console.log(response.data);
        setUserTypes(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="consent" element={<Consent />} />
        <Route path="sign-up" element={<SignupNew userTypes={userTypes} />} />
        <Route path="dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
