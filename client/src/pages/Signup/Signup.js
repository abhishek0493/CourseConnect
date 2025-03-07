import React, { useContext } from 'react';
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
  Alert,
  Typography,
} from '@mui/material';

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import image from './Connected world-amico.png';
import axios from 'axios';
import errorImg from '../../images/Warning-bro.png';
import ParentContext from '../../ParentContext';

const SignupNew = ({ userTypes, onSignUpSuccess }) => {
  const { baseUrl, setBaseUrl } = useContext(ParentContext);

  const location = useLocation();
  const state = location.state;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 0,
    type_value: '',
    consent: state ? 1 : 0,
  });

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
      .post(`${baseUrl}/api/v1/auth/signUp`, formData)
      .then((res) => {
        onSignUpSuccess(true);
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        const response = err.response;
        if (!response.data.success) {
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
      });
  };

  return (
    <Box sx={{ p: 8 }}>
      {state ? (
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
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ alignItems: 'center', margin: 'auto 0' }}
          >
            <Typography
              variant="h5"
              component="h4"
              color="primary"
              align="center"
              sx={{
                mb: '2rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
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
                    error={
                      validationError && validationMessage.includes('name')
                    }
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
      ) : (
        <Box>
          <Grid container justifyContent={'cnter'}>
            <Grid item xs={8}>
              <img
                src={errorImg}
                alt="Logo"
                style={{
                  width: '500px',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3" gutterBottom>
                Consent not received.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Please click on the link below to read the participant
                information sheet & provide consent.
              </Typography>
              <Link to="/consent">Click Here</Link>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default SignupNew;
