import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControlLabel,
  InputLabel,
  FormControl,
  Checkbox,
  Button,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import image from './Connected world-amico.png';
import axios from 'axios';

// import './signup.css';

const SignupNew = ({ userTypes }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 0,
    type_value: '',
  });

  const location = useLocation();
  const state = location.state;

  const [validationError, setValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError(false);
    setValidationMessage('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    await axios
      .post('http://localhost:8000/api/v1/auth/signUp', formData)
      .then((res) => {
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        const response = err.response;
        if (!response.data.success) {
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
        // console.log(err);
      });
  };

  return (
    <Box sx={{ p: 8 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img
            src={image}
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
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h2"
            component="h2"
            color="primary"
            align="center"
            sx={{ marginBottom: '2rem' }}
          >
            Create an account
          </Typography>

          <form onSubmit={handleSignUp}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={validationError && validationMessage.includes('name')}
                  helperText={
                    validationError && validationMessage.includes('name')
                      ? validationMessage
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={6}>
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
                {/* Type of User row */}
                <FormControl fullWidth>
                  <InputLabel>Profession</InputLabel>
                  <Select
                    label="User Type"
                    name="type"
                    onChange={handleChange}
                    error={
                      validationError && validationMessage.includes('type')
                    }
                    helperText={
                      validationError && validationMessage.includes('type')
                        ? validationMessage
                        : ''
                    }
                  >
                    <MenuItem value="0">--- Select ----</MenuItem>
                    {Object.values(userTypes).map((value) => (
                      <MenuItem value={value.type_id}>{value.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {/* Profession row */}
                <TextField
                  label="Name of the University/Company (Optional)"
                  fullWidth
                  name="type_value"
                  value={formData.type_value}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  fullWidth
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  error={
                    validationError &&
                    validationMessage.includes('confirm password')
                  }
                  helperText={
                    validationError &&
                    validationMessage.includes('confirm password')
                      ? validationMessage
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12}>
                {/* Consent checkbox row */}
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Consent Received"
                  checked
                  disabled={state}
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
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupNew;
