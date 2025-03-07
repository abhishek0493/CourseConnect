import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

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
import Requests from './pages/Dashboard/Requests';
import CommunityRequests from './pages/Dashboard/CommunityRequests';
import NoAccess from './pages/NoAccess/NoAccess';
import SavedThreads from './pages/Dashboard/SavedThreads';
import SearchResults from './pages/Dashboard/SearchResults';
import MobileNotSupported from './pages/NoAccess/MobileNotSupported';
import FeedbackForm from './pages/Feedback/FeedbackForm';

function App() {
  const mobileScreenWidth = 768;
  const isMobile = window.innerWidth < mobileScreenWidth;

  const [userTypes, setUserTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [baseUrl, setBaseUrl] = useState(
    process.env.REACT_APP_ENV == 'production'
      ? process.env.REACT_APP_BASE_URL
      : process.env.REACT_APP_SERVER_URL
  );

  const fetchLoggedInStatus = () => {
    axios
      .get(`${baseUrl}/api/v1/auth/check-login`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setIsLoggedIn(true);
          setUser(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  };

  const fetchUserTypes = async () => {
    await axios
      .get(`${baseUrl}/api/v1/users/categories`)
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
      .get(`${baseUrl}/api/v1/categories/access-types`)
      .then((response) => {
        setAccessTypes(response.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const fetchUserCommunities = async () => {
    await axios
      .get(`${baseUrl}/api/v1/community`, {
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
      .get(`${baseUrl}/api/v1/community/categories`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const res = Refactor(response.data);
          setCategories(res);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleUpdateTrigger = (bool) => {
    if (bool) {
      fetchUserCommunities();
      fetchLoggedInStatus();
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
      <ParentContext.Provider value={{ user, setUser, baseUrl, setBaseUrl }}>
        <Routes>
          <Route
            element={
              isMobile ? (
                <MobileNotSupported />
              ) : (
                <LayoutMain
                  isLoggedIn={isLoggedIn}
                  triggerAuthUpdate={handleUpdateTrigger}
                />
              )
            }
          >
            <Route path="/" element={<Home />} />
            <Route
              path="consent"
              element={isLoggedIn ? <NoAccess /> : <Consent />}
            />
            <Route
              path="login"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard"></Navigate>
                ) : (
                  <Login isLoggedIn={handleUpdateTrigger} />
                )
              }
            />
            <Route
              path="sign-up"
              element={
                <Signup
                  userTypes={userTypes}
                  onSignUpSuccess={handleUpdateTrigger}
                />
              }
            />
            {/* Post Login Routes */}
            <Route
              path="dashboard"
              element={
                isLoggedIn ? (
                  <LayoutSecondary communities={communities} />
                ) : (
                  <NoAccess />
                )
              }
            >
              <Route
                index
                element={<Dashboard updateTrigger={handleUpdateTrigger} />}
              />
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
                    onCreateCommunity={handleUpdateTrigger}
                  />
                }
              />
              <Route
                path="c"
                element={<ThreadsLayout triggerUpdate={handleUpdateTrigger} />}
              >
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
              <Route path="view-all-requests" element={<Requests />}></Route>
              <Route
                path="view-all-saved"
                element={<SavedThreads updateTrigger={handleUpdateTrigger} />}
              ></Route>
              <Route
                path="custom-search"
                element={<SearchResults updateTrigger={handleUpdateTrigger} />}
              ></Route>
              <Route
                path=":name/view-requests"
                element={<CommunityRequests />}
              ></Route>
              <Route path="user-feedback" element={<FeedbackForm />}></Route>
            </Route>
          </Route>
          <Route path="*" element={<NoAccess />} />
        </Routes>
      </ParentContext.Provider>
    </BrowserRouter>
  );
}

export default App;
