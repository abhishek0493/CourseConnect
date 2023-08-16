import { Box, Button, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import ThreadTitleBar from '../../components/Thread/ThreadTitleBar';
import axios from 'axios';
import { Refactor } from '../../components/Constants/Refactor';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';
import Filters from '../../components/Common/Filters';
import ParentContext from '../../ParentContext';

const ThreadsLayout = () => {
  const { baseUrl } = useContext(ParentContext);
  const { name } = useParams();
  const location = useLocation();

  const [threads, setThreads] = useState([]);
  const [community, setCommunity] = useState([]);
  const [filterState, setFilterState] = useState({
    isSaved: 0,
    isCourse: 0,
    isAuthorPosted: 0,
    isCategory: 0,
  });

  const fetchCommunityDetails = async () => {
    const url = `${baseUrl}/api/v1/community/${name}`;
    await axios
      .get(url, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          const result = Refactor(res.data);
          // const resultWithIcon = AddCategoryIcon(result);
          setCommunity(result);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const fetchCommunityThreads = async (filters) => {
    let url = `${baseUrl}/api/v1/threads/${name}/get-threads`;
    if (filters) {
      const queryParams = new URLSearchParams(filters).toString();
      url = `${baseUrl}/api/v1/threads/${name}/get-threads?${queryParams}`;
    }
    await axios
      .get(url, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          const result = Refactor(res.data);
          const resultWithIcons = AddCategoryIcon(result);
          setThreads(resultWithIcons);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const handleShowSaveThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isSaved: value,
    }));
  };

  const handleShowCourseThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isCourse: value,
    }));
  };

  const handleShowPostedThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isAuthorPosted: value,
    }));
  };

  const handleResetFilters = () => {
    setFilterState({
      isSaved: 0,
      isCourse: 0,
      isAuthorPosted: 0,
      isCategory: 0,
    });
  };

  useEffect(() => {
    fetchCommunityThreads(filterState);
    fetchCommunityDetails();
  }, [location, filterState]);

  return (
    <Box>
      <ThreadTitleBar name={name} community={community} />
      <CreatePostBar community={community} />
      <Filters
        filterState={filterState}
        toggleSaved={handleShowSaveThreads}
        toggleCourse={handleShowCourseThreads}
        togglePosted={handleShowPostedThreads}
        handleReset={handleResetFilters}
      />
      <Box sx={{ my: 2 }}>
        <Outlet context={[threads, setThreads]} />
      </Box>
    </Box>
  );
};

export default ThreadsLayout;
