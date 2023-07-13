import { Paper, Typography, Box, Card, Grid, Divider } from '@mui/material';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';

import React from 'react';

const ThreadTitleBar = () => {
  return (
    <Card
      sx={{
        p: 2,
        my: 1,
        bgcolor: 'paper',
      }}
    >
      <Grid container gap={3} alignItems={'center'}>
        <Grid item xs={1}>
          <PsychologyTwoToneIcon
            sx={{ fontSize: '60px', color: 'action.main' }}
          />
        </Grid>
        <Grid item xs={8} alignItems={'center'}>
          <Typography variant="h4" fontWeight={'bold'} letterSpacing={1}>
            LearnJapanese
          </Typography>
          <Divider />
          <Typography variant="caption" sx={{ my: 1 }}>
            Created by u/Abhishek
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ThreadTitleBar;
