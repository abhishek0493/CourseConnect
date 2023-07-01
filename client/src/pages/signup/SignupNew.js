import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import image from './signupimg.png';
import Typography from '@mui/material/Typography';

import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// import './signup.css';

const SignupNew = (props) => {
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
          // console.log(response.data.message);
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
        console.log(err);
      });
  };

  return (
    <Container fixed sx={{ padding: '60px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img src={image} style={{ width: '100%' }} alt="Your Image" />
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
            variant="h3"
            component="h2"
            color="primary"
            align="center"
            sx={{ margin: '40px 0' }}
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Type of User row */}
                <FormControl fullWidth>
                  <InputLabel>Profession</InputLabel>
                  <Select label="User Type" name="type" onChange={handleChange}>
                    <MenuItem value="0">--- Select ----</MenuItem>
                    {Object.values(props.userTypes).map((value) => (
                      <MenuItem value={value.type_id}>{value.name}</MenuItem>
                    ))}
                    {/* <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="instructor">Instructor/Teacher</MenuItem>
                    <MenuItem value="learning-professional">
                      Working Professional
                    </MenuItem> */}
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
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  fullWidth
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                <Button variant="contained" color="primary" fullWidth>
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupNew;
