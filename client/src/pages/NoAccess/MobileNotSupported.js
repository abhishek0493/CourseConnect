import React from 'react';
import image from '../../images/mobile.png';
import { Container, Box, Typography } from '@mui/material';

const MobileNotSupported = () => {
  return (
    <Container component={'main'}>
      <Box sx={{ alignItems: 'center', p: 2 }}>
        <img src={image} style={{ width: '100%' }}></img>
        <Typography variant="h6" component={'p'}>
          We apologize, but the Course Connect app is currently not supported on
          mobile devices. Please use the web app on a desktop or laptop device
          for the best experience. We appreciate your understanding!
        </Typography>
      </Box>
    </Container>
  );
};

export default MobileNotSupported;
