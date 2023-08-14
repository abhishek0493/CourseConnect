import { Alert, Box } from '@mui/material';
import React from 'react';
import image from '../../images/NoAccess.png';

const NoAccess = () => {
  return (
    <Box>
      <img
        src={image}
        style={{ width: '40%', display: 'block', margin: '0 auto' }}
        alt="No Access"
      ></img>
    </Box>
  );
};

export default NoAccess;
