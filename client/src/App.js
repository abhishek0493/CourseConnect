import Signup from './pages/signup/Signup';
import SignupNew from './pages/signup/SignupNew';
import Home from './pages/home/home';
import Navbar from './components/navbar/navbar';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import Consent from './pages/consent/consent';

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
        <Route path="/" element={<Home />}></Route>
        <Route path="/consent" element={<Consent />}></Route>
        <Route
          path="/sign-up"
          element={<SignupNew userTypes={userTypes} />}
        ></Route>
        <Route path="/dashboard" element={<Navbar />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
