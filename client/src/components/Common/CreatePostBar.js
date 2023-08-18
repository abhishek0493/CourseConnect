import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Grid,
  Badge,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LightbulbCircleTwoToneIcon from '@mui/icons-material/LightbulbCircleTwoTone';
import { useNavigate } from 'react-router-dom';

const CreatePostBar = ({ community, isAccess }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onFocus = () => {
    if (isAccess !== undefined && isAccess === false) {
      setOpen(true);
    } else if (community) {
      navigate(`/dashboard/create-thread?id=${community.id}`, {
        replace: true,
      });
    } else {
      navigate('/dashboard/create-thread', { replace: true });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        px: 1,
        py: 3,
        maxHeight: '60px',
        alignItems: 'center',
      }}
      elevation={0}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={1}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color="success"
          >
            <Avatar
              sx={{ bgcolor: 'secondary.main', color: 'primary.dark', ml: 1 }}
            >
              <AccountCircleTwoToneIcon />
            </Avatar>
          </Badge>
        </Grid>
        <Grid item xs={10}>
          <TextField
            label={<Typography variant="body2">Create a thread</Typography>}
            size="small"
            fullWidth
            onFocus={onFocus}
          ></TextField>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: '100%' }}
            >
              You are not a member of this community yet
            </Alert>
          </Snackbar>
        </Grid>
        <Grid item xs={1}>
          <LightbulbCircleTwoToneIcon
            sx={{ fontSize: '40px', color: 'orangered' }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CreatePostBar;
