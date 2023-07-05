import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';

import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import Consent from './pages/Consent/Consent';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import LayoutMain from './components/LayoutMain';
import LayoutSecondary from './components/LayoutSecondary';
import CreateCommunity from './pages/Community/Create';

function App() {
  const [userTypes, setUserTypes] = useState([]);
  const fetchUserTypes = () => {
    axios
      .get('http://localhost:8000/api/v1/users/categories')
      .then((response) => {
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
        <Route element={<LayoutMain />}>
          <Route path="/" element={<Home />} />
          <Route path="consent" element={<Consent />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Signup userTypes={userTypes} />} />
          <Route path="dashboard" element={<LayoutSecondary />}>
            <Route path="create-community" element={<CreateCommunity />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
