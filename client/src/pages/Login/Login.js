import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Container,
} from '@mui/material';

import loginImage from '../../images/Login.png';

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
        // console.log(response);
        if (!response.data.success) {
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
      });
  };

  return (
    <Container sx={{ p: 8 }}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ alignContent: 'center', margin: 'auto 0' }}
        >
          <Typography
            variant="h5"
            component="h2"
            color="primary"
            align="center"
            sx={{ mb: '2rem', textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            LOGIN
          </Typography>

          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
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
                  size="small"
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
                  size="small"
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
            src={loginImage}
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
    </Container>
  );
};

export default Login;
