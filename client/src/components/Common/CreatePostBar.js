import React from 'react';
import {
  Card,
  Avatar,
  Grid,
  Badge,
  TextField,
  Typography,
} from '@mui/material';
import PagesRoundedIcon from '@mui/icons-material/PagesRounded';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { useNavigate } from 'react-router-dom';

const CreatePostBar = ({ community }) => {
  const navigate = useNavigate();

  const onFocus = () => {
    if (community) {
      navigate(`/dashboard/create-thread?id=${community.id}`, {
        replace: true,
      });
    } else {
      navigate('/dashboard/create-thread', { replace: true });
    }
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
        </Grid>
        <Grid item xs={1}>
          <PagesRoundedIcon sx={{ fontSize: '40px', color: 'orangered' }} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CreatePostBar;
