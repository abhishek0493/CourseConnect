import React, { useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Box, Alert, Stack } from '@mui/material';
import axios from 'axios';
import { Refactor } from '../../components/Constants/Refactor';
import FilterBar from '../../components/Dashboard/FilterBar';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const Dashboard = () => {
  const [threads, setThreads] = useState([]);

  const [url, setUrl] = useState('');

  const [filterState, setFilterState] = useState({
    isSaved: 0,
    isCourse: 0,
    isAuthorPosted: 0,
    isCategory: 0,
  });

  const [title, setTitle] = useState('Trending Threads');

  const fetchTrendingThreads = (filters) => {
    let url = 'http://localhost:8000/api/v1/dashboard';
    if (filters) {
      const queryParams = new URLSearchParams(filterState).toString();
      url = `http://localhost:8000/api/v1/dashboard?${queryParams}`;
    }

    axios.get(url, { withCredentials: true }).then((res) => {
      if (res.data.success) {
        const response = Refactor(res.data);
        const resWithIcons = AddCategoryIcon(response);
        setThreads(resWithIcons);
      }
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

  const handleShowCategoryThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isCategory: value,
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
    fetchTrendingThreads(filterState);
  }, [filterState]);

  return (
    <>
      <CreatePostBar />
      <FilterBar
        handleSavedToggle={handleShowSaveThreads}
        handleFilterByCategory={handleShowCategoryThreads}
        handleCourseToggle={handleShowCourseThreads}
        handlePostedToggle={handleShowPostedThreads}
        handleReset={handleResetFilters}
        filterState={filterState}
        title={title}
      />
      <Box sx={{ my: 2 }}>
        {threads.length === 0 ? (
          <>
            <Alert severity="warning">
              No threads created in this community yet!
            </Alert>
          </>
        ) : (
          <Stack spacing={2}>
            {threads.map((item) => (
              <DashboardThreads thread={item} />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
