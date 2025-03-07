import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import image5 from './Connected world-cuate.svg';

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Grid container>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={image5}
              alt="logo"
              style={{ width: '85%', display: 'block', margin: '0 auto' }}
            ></img>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ padding: '45px', alignItems: 'center', margin: 'auto 0' }}
        >
          <Typography variant="h2" color="action.main">
            Welcome to Course Connect
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="p">
              Course Connect is an online platform that brings together learners
              and instructors from various fields. Whether you're looking to
              expand your knowledge, enhance your skills, or share your
              expertise, CourseConnect has something for everyone.
            </Typography>
            <Typography variant="p">
              Explore a wide range of courses, connect with like-minded
              individuals, and embark on a journey of continuous learning. Join
              our community today and unlock endless possibilities!
            </Typography>
          </Box>
          <Typography variant="p">
            Start your learning adventure now!
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                navigate('consent', { replace: true });
              }}
            >
              Sign up
            </Button>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Already registered ? <Link to="/login">Click here</Link> to Login
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
