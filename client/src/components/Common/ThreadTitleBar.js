import React from 'react';
import { Typography, Card, Grid, Divider, Avatar, Button } from '@mui/material';

const ThreadTitleBar = ({ community, name }) => {
  console.log(community);
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
          </Typography>
          <Divider />
          <Typography variant="caption" sx={{ my: 1 }}>
            Created by u/Abhishek
          </Typography>
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
