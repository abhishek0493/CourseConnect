import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { makeStyles } from '@mui/styles';

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

const LoginNew = ({ isLoggedIn }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          className={classes.avatar}
          sx={{ width: '120px', height: '120px' }}
        >
          <LockOutlinedIcon sx={{ fontSize: '80px' }} />
        </Avatar>
        <Typography component="h1" variant="h5" fontWeight={'bold'}>
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <Grid
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
      </Grid> */}

      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} Course Connect
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginNew;
