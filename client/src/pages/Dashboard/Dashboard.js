import React, { useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Box, Card, Alert, Stack } from '@mui/material';
import axios from 'axios';
import { Refactor } from '../../components/Constants/Refactor';
import ThreadCard from '../../components/Thread/ThreadCard';
import FilterBar from '../../components/Dashboard/FilterBar';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';

const Dashboard = () => {
  const [threads, setThreads] = useState([]);
  const fetchTrendingThreads = async () => {
    await axios.get('http://localhost:8000/api/v1/dashboard').then((res) => {
      if (res.data.success) {
        const response = Refactor(res.data);
        setThreads(response);
      }
    });
  };

  useEffect(() => {
    fetchTrendingThreads();
  }, []);

  return (
    <>
      <CreatePostBar />
      <FilterBar />
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
