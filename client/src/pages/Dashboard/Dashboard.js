import React from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Box, Card } from '@mui/material';

const Dashboard = () => {
  return (
    <>
      <CreatePostBar />
      <Box sx={{ my: 5, p: 2 }}>
        <Card sx={{ p: 5 }}>Coming Soon</Card>
      </Box>
    </>
  );
};

export default Dashboard;
