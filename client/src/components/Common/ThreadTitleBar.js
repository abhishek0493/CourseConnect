import React from 'react';
import {
  Typography,
  Card,
  Grid,
  Divider,
  Avatar,
  Button,
  Box,
  Tooltip,
} from '@mui/material';

import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import LockPersonIcon from '@mui/icons-material/LockPerson';

const getAccessIcon = (type) => {
  let icon = null;
  let message = '';
  switch (type) {
    case 1:
      icon = <AllInclusiveIcon htmlColor="green" />;
      message =
        'This community is open. Anyone can join and post in this community';
      break;
    case 2:
      icon = <AddModeratorIcon htmlColor="orange" />;
      message =
        'This community is restricted. Threads can be viewed but requires creator approval for posting in this community';
      break;
    case 3:
      icon = <LockPersonIcon htmlColor="red" />;
      message =
        'This community is protected. Viewing and creating threads requires creator approval';
      break;
    default:
      break;
  }
  return {
    icon: icon,
    message: message,
  };
};

const ThreadTitleBar = ({ community, name }) => {
  return (
    <Card
      sx={{
        p: 2,
        my: 1,
        bgcolor: 'paper',
      }}
    >
      <Grid container gap={4} alignItems={'center'}>
        <Grid item xs={1}>
          <Avatar
            sx={{
              bgcolor: '#2e2e78',
              width: '4rem',
              height: '4rem',
              color: 'paper',
            }}
          >
            {community.icon &&
              React.cloneElement(community.icon, {
                sx: { fontSize: '3rem', color: 'paper' },
              })}
          </Avatar>
        </Grid>
        <Grid item xs={8} alignItems={'center'}>
          <Typography variant="h5" fontWeight={'bold'} letterSpacing={1}>
            {name}
            <Tooltip
              sx={{ mx: 1 }}
              title={getAccessIcon(community.access_type).message}
            >
              {getAccessIcon(community.access_type).icon}
            </Tooltip>
          </Typography>
          <Divider />
          <Typography variant="caption">Created by u/Abhishek</Typography>
          <Typography
            variant="caption"
            sx={{ my: 1, display: 'block', fontStyle: 'italic' }}
          >
            {community.description}
          </Typography>
        </Grid>
        <Grid item xs={1} alignItems={'center'}>
          <Button variant="outlined">created</Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ThreadTitleBar;
