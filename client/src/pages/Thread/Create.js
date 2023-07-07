import React from 'react';
import {
  Box,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CreatePostCard from '../../components/Common/CreatePostCard';

const CreateThread = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={'bold'}>
        Create a thread
      </Typography>
      <CreatePostCard />
    </Box>
  );
};

export default CreateThread;
