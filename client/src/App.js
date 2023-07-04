import SignupNew from './pages/signup/SignupNew';
import Home from './pages/home/home';
import Layout from './components/Layout';
import Consent from './pages/consent/consent';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [userTypes, setUserTypes] = useState([]);
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
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="consent" element={<Consent />} />
          <Route path="sign-up" element={<SignupNew userTypes={userTypes} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
