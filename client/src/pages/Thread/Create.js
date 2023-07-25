import React from 'react';
import { Box, Typography } from '@mui/material';
import CreatePostCard from '../../components/Common/CreatePostCard';
import { useLocation } from 'react-router-dom';

const CreateThread = ({ communities }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') !== null ? searchParams.get('id') : 0;
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={'bold'}>
        Create a thread
      </Typography>
      <CreatePostCard communities={communities} selectedId={id} />
    </Box>
  );
};

export default CreateThread;
