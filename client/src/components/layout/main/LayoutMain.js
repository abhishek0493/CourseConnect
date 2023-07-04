import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const LayoutMain = (props) => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" component="p">
        {props.test}
      </Typography>
      <Typography variant="p">Dashboard Home Content Page</Typography>
      <Button
        variant="contained"
        sx={{ display: 'block' }}
        onClick={() => props.updatedText('This it the updated content')}
      >
        Click
      </Button>
    </Box>
  );
};

export default LayoutMain;
