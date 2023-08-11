import React, { useContext } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Grid, Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SecondarySidebar from './Dashboard/SecondarySidebar';
import ParentContext from '../ParentContext';

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
    padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
    marginLeft: '254px', // Same as the width of the sidebar
    // marginTop: theme.spacing(0.5)
  },
  card: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    height: '500px',
  },
}));

const LayoutSecondary = ({ communities }) => {
  const classes = useStyles();
  const { user, setUser } = useContext(ParentContext);

  console.log(user);

  return (
    <>
      <Box sx={{ display: 'flex', bgcolor: '#DAE0E6' }}>
        <Sidebar communities={communities} />
        <main className={classes.content}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box>
                <Outlet />
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ p: 6 }}>
              <Card variant="outlined" sx={{ position: 'sticky', top: 80 }}>
                <SecondarySidebar user={user} />
              </Card>
            </Grid>
          </Grid>
        </main>
      </Box>
    </>
  );
};

export default LayoutSecondary;
