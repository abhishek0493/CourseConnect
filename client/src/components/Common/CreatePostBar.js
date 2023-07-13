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

const CreatePostBar = () => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        display: 'flex',
        px: 1,
        py: 3,
        maxHeight: '60px',
        alignItems: 'center',
      }}
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
            variant="outlined"
            label={
              <Typography color="primary.dark">
                Create a thread / post
              </Typography>
            }
            size="small"
            fullWidth
            onFocus={() => {
              navigate('/dashboard/create-thread', { replace: true });
            }}
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
