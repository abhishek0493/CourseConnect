import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CreatePostCard from '../../components/Common/CreatePostCard';
import axios from 'axios';
import { Refactor } from '../../components/Constants/Refactor';

const CreateThread = ({ communities }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={'bold'}>
        Create a thread
      </Typography>
      <CreatePostCard communities={communities} />
    </Box>
  );
};

export default CreateThread;
