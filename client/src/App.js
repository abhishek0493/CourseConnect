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
import { Categories } from './components/Constants/Categories';
import CreatePostBar from './components/Common/CreatePostBar';
import CreateThread from './pages/Thread/Create';

function App() {
  const [userTypes, setUserTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [communities, setCommunities] = useState([]);

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

  const fetchCommunities = () => {
    axios
      .get('http://localhost:8000/api/v1/community')
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          Object.values(res).map((el) => {
            Categories.map((item) => {
              if (item.id == el.category_id) {
                el.icon = item.icon;
                el.color = item.color;
              }
            });
          });
          // console.log(res);
          setCommunities(res);
        }
      })
      .catch((error) => {
        console.error(error);
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

  const handleCreateCommunity = (bool) => {
    if (bool) {
      fetchCommunities();
    }
  };

  useEffect(() => {
    fetchUserTypes();
    fetchAccessTypes();
    fetchCategories();
    fetchCommunities();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutMain />}>
          <Route path="/" element={<Home />} />
          <Route path="consent" element={<Consent />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Signup userTypes={userTypes} />} />
          <Route
            path="dashboard"
            element={<LayoutSecondary communities={communities} />}
          >
            <Route index element={<CreatePostBar />} />
            <Route path="create-thread" element={<CreateThread />}></Route>
            <Route
              path="create-community"
              element={
                <CreateCommunity
                  accessTypes={accessTypes}
                  cmCategories={categories}
                  onCreateCommunity={handleCreateCommunity}
                />
              }
            />
            <Route path="community" element="" />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
