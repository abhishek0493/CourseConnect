import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Grid, Card, Typography } from '@mui/material';

const LayoutSecondary = () => {
  return (
    <>
      <Box sx={{ display: 'flex', bgcolor: '#e3e3e3e3' }}>
        <Box>
          <Sidebar />
        </Box>
        <Grid container columnSpacing={4} sx={{ p: 4 }}>
          <Grid item xs={8}>
            <Box>
              <Outlet />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Card variant="outlined">
              <Box sx={{ height: '80vh' }}>
                <Typography variant="p">Secondary Siderbar</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LayoutSecondary;
