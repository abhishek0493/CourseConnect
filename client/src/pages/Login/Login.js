import React, { useContext } from 'react';
import {
  Button,
  Typography,
  Container,
  Avatar,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import loginImage from '../../images/Login.png';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParentContext from '../../ParentContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(4),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    marginTop: '2rem',
  },
}));

axios.defaults.withCredentials = true;

const Login = ({ isLoggedIn }) => {
  const classes = useStyles();

  const { baseUrl } = useContext(ParentContext);
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
      .post(`${baseUrl}/api/v1/auth/login`, formData)
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          isLoggedIn(true);
          navigate('/dashboard', { replace: true });
        }
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
    <Container component="main" sx={{ p: 8 }}>
      <Grid container spacing={3}>
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
        <Grid item sx={12} sm={6}>
          <div className={classes.paper}>
            <Avatar
              className={classes.avatar}
              sx={{ width: '120px', height: '120px' }}
            >
              <LockOutlinedIcon sx={{ fontSize: '80px', color: 'orangered' }} />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={'bold'}>
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={handleLogin}>
              <TextField
                variant="outlined"
                margin="normal"
                type="email"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={validationError && validationMessage.includes('email')}
                helperText={
                  validationError && validationMessage.includes('email')
                    ? validationMessage
                    : ''
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
              <Grid container sx={{ mt: 2 }}>
                <Grid item>
                  <Link
                    onClick={() => {
                      navigate('/consent', { replace: true });
                    }}
                    variant="body2"
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
