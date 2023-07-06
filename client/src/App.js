import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';

import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import Consent from './pages/Consent/Consent';
import Login from './pages/Login/Login';
import LayoutMain from './components/LayoutMain';
import LayoutSecondary from './components/LayoutSecondary';
import CreateCommunity from './pages/Community/Create';
import { Refactor } from './components/Constants/Refactor';

// const refactorResponse = (response) => {
//   const { success, data, message } = response;

//   if (!success) {
//     return {
//       success,
//       error: message,
//     };
//   }

//   return data;
// };

function App() {
  const [userTypes, setUserTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchUserTypes = () => {
    axios
      .get('http://localhost:8000/api/v1/users/categories')
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          console.log(res);
          setUserTypes(res);
        }
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  const fetchAccessTypes = () => {
    axios
      .get('http://localhost:8000/api/v1/categories/access-types')
      .then((response) => {
        // console.log(response.data);
        setAccessTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCategories = () => {
    axios
      .get('http://localhost:8000/api/v1/community/categories')
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          // console.log(res);
          setCategories(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserTypes();
    fetchAccessTypes();
    fetchCategories();
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
            <Route
              path="create-community"
              element={
                <CreateCommunity
                  accessTypes={accessTypes}
                  cmCategories={categories}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
