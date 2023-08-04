import React from 'react';
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
import CreateThread from './pages/Thread/Create';
import ThreadsLayout from './pages/Thread/ThreadsLayout';
import CommunityThreads from './pages/Thread/CommunityThreads';
import { AddCategoryIcon } from './utils/AddCategoryIcon';
import ThreadDetails from './pages/Thread/ThreadDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import ParentContext from './ParentContext';

function App() {
  const [userTypes, setUserTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const fetchLoggedInStatus = async () => {
    await axios
      .get('http://localhost:8000/api/v1/auth/check-login', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setIsLoggedIn(true);
          setUser(res.data.data);
        }
      });
  };

  const updateLoginStatus = (bool) => {
    setIsLoggedIn(bool);
    if (bool) fetchUserCommunities();
  };

  const fetchUserTypes = async () => {
    await axios
      .get('http://localhost:8000/api/v1/users/categories')
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          setUserTypes(res);
        }
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  const fetchAccessTypes = async () => {
    await axios
      .get('http://localhost:8000/api/v1/categories/access-types')
      .then((response) => {
        setAccessTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserCommunities = async () => {
    await axios
      .get('http://localhost:8000/api/v1/community', {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          const resWithIcons = AddCategoryIcon(res);
          setCommunities(resWithIcons);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCategories = async () => {
    await axios
      .get('http://localhost:8000/api/v1/community/categories', {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          setCategories(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateCommunity = (bool) => {
    if (bool) {
      fetchUserCommunities();
    }
  };

  useEffect(() => {
    fetchLoggedInStatus();
    fetchUserTypes();
    fetchAccessTypes();
    fetchCategories();
    fetchUserCommunities();
  }, []);

  return (
    <BrowserRouter>
      <ParentContext.Provider
        value={{
          isLoggedIn,
          user,
        }}
      >
        <Routes>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<Home />} />
            <Route path="consent" element={<Consent />} />
            <Route
              path="login"
              element={<Login isLoggedIn={updateLoginStatus} />}
            />
            <Route path="sign-up" element={<Signup userTypes={userTypes} />} />
            {/* Post Login Routes */}
            <Route
              path="dashboard"
              element={<LayoutSecondary communities={communities} />}
            >
              <Route index element={<Dashboard />} />
              <Route
                path="create-thread"
                element={<CreateThread communities={communities} />}
              />
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
              <Route path="c" element={<ThreadsLayout />}>
                <Route
                  path=":name"
                  index
                  element={<CommunityThreads />}
                ></Route>
              </Route>
              <Route
                path="c/:name/:thread_id/comments"
                element={<ThreadDetails />}
              ></Route>
            </Route>
          </Route>
        </Routes>
      </ParentContext.Provider>
    </BrowserRouter>
  );
}

export default App;
