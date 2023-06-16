import Signup from './pages/signup/Signup';
import Home from './pages/home/home';
import Sidebar from './components/sidebar/sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route exact path="/" element={<Sidebar />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/signup" element={<Signup userTypes={userTypes} />} />
      </Routes>
    </Router>
    // <div className="App">
    //   <Consent />
    //   {/* <Signup userTypes={userTypes} /> */}
    // </div>
  );
}

export default App;
