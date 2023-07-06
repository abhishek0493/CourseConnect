import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Grid, Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: '280px',
    flexShrink: 0,
    position: 'fixed',
    top: theme.spacing(8), // Adjust the top position as needed
    bottom: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: '254px', // Same as the width of the sidebar
    // marginTop: theme.spacing(0.5)
  },
  card: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    height: '500px',
  },
}));

const LayoutSecondary = () => {
  const classes = useStyles();

  return (
    <>
      <Box sx={{ display: 'flex', bgcolor: '#e3e3e3e3' }}>
        <Sidebar />
        <main className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Outlet />
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined">
                <Box sx={{ height: '80vh' }}>
                  <Typography variant="p">Secondary Siderbar</Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </main>
      </Box>
    </>
  );
};

export default LayoutSecondary;
