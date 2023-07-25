import React from 'react';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';

import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Login = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const location = useLocation();
  // const state = location.state;

  const [validationError, setValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError(false);
    setValidationMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await axios
      .post('http://localhost:8000/api/v1/auth/login', formData)
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          isLoggedIn(true);
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((err) => {
        // console.log(err);
        const response = err.response;
        console.log(response);
        if (!response.data.success) {
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
      });
  };

  return (
    <Box sx={{ p: 8 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h2"
            component="h2"
            color="primary"
            align="center"
            sx={{ marginBottom: '2rem' }}
          >
            LOGIN
          </Typography>

          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Password and Confirm Password row */}
                <TextField
                  label="Password"
                  fullWidth
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={
                    validationError && validationMessage.includes('password')
                  }
                  helperText={
                    validationError && validationMessage.includes('password')
                      ? validationMessage
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12}>
                {/* Submit button */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            src=""
            style={{ width: '80%', display: 'block', margin: '0 auto' }}
            alt="Your Image"
          />
          <Typography
            variant="caption"
            component="p"
            color="dark"
            align="center"
          >
            Course Connect
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
