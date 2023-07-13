import { Paper, Typography, Box } from '@mui/material';
import React from 'react';

const ThreadTitleBar = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        my: 1,
        bgcolor: 'paper',
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={'bold'}>
          React.js
        </Typography>
        <Typography variant="caption">Science & Technology</Typography>
      </Box>
    </Paper>
  );
};

export default ThreadTitleBar;
