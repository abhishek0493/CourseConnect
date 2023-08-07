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
  const [title, setTitle] = useState('Trending Threads');

  const fetchTrendingThreads = async (filters) => {
    let url = 'http://localhost:8000/api/v1/dashboard';
    if (filters) {
      const queryParams = new URLSearchParams(filters).toString();
      url = `http://localhost:8000/api/v1/dashboard?${queryParams}`;
    }

    await axios.get(url, { withCredentials: true }).then((res) => {
      if (res.data.success) {
        const response = Refactor(res.data);
        const resWithIcons = AddCategoryIcon(response);
        setThreads(resWithIcons);
      }
    });
  };

  const handleShowSaveThreads = (filterObj) => {
    fetchTrendingThreads(filterObj);
    setTitle('Saved Threads');
  };

  const handleShowTrendingThreads = () => {
    fetchTrendingThreads();
    setTitle('Trending Threads');
  };

  const handleShowCategoryThreads = (value) => {
    fetchTrendingThreads({ category: value });
  };

  const handleResetFilters = () => {
    fetchTrendingThreads();
  };

  useEffect(() => {
    fetchTrendingThreads();
  }, []);

  return (
    <>
      <CreatePostBar />
      <FilterBar
        handleGetSave={handleShowSaveThreads}
        handleGetTrending={handleShowTrendingThreads}
        handleFilterByCategory={handleShowCategoryThreads}
        handleReset={handleResetFilters}
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
