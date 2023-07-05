import React from 'react';
import { makeStyles } from '@mui/styles';
import {
  Grid,
  AppBar,
  Toolbar,
  Card,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import Sidebar from '../../components/Sidebar/Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
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
    marginLeft: '280px', // Same as the width of the sidebar
    marginTop: theme.spacing(8), // Adjust the top margin as needed
  },
  card: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    height: '500px',
  },
}));

const Test = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            CourseConnect
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      <Sidebar className={classes.sidebar} />

      <main className={classes.content}>
        {/* Scrollable content */}
        <Grid container spacing={3}>
          <Grid item xs={8}>
            {/* Cards */}
            <Card className={classes.card}>Card Abhishek</Card>
            <Card className={classes.card}>Card Abhishek</Card>
            <Card className={classes.card}>Card Abhishek</Card>
            {/* Add more cards as needed */}
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Test;
