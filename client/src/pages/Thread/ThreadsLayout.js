import { Box, Typography } from '@mui/material';
import React from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Outlet } from 'react-router-dom';
import ThreadTitleBar from '../../components/Common/ThreadTitleBar';

const ThreadsLayout = () => {
  return (
    <Box>
      <ThreadTitleBar />
      <CreatePostBar />
      <Box sx={{ my: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ThreadsLayout;
