import React, { useContext } from 'react';

import {
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  Avatar,
} from '@mui/material';

import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ParentContext from '../../ParentContext';
import { useNavigate } from 'react-router-dom';

const SecondarySidebar = () => {
  const { isLoggedIn, user } = useContext(ParentContext);
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '80vh', p: 3 }}>
      <Box sx={{ display: 'flex' }}>
        <InsertEmoticonRoundedIcon sx={{ mr: 1, color: 'green' }} />
        <Typography variant="body2" fontWeight={'bold'}>
          {user && user.name != undefined && <span>u/{user.name}</span>}
          {/* u/{user && user.name != undefined ? user.name : ''} */}
        </Typography>
      </Box>
      <Divider sx={{ mt: 1, borderWidth: '1px' }} />
      <Box sx={{ mt: 3 }}>
        <Grid container alignItems={'center'}>
          <Grid item xs={4}>
            <Avatar
              sx={{
                bgcolor: '#090979',
                width: '4rem',
                height: '4rem',
                color: 'paper',
              }}
            >
              <GroupsRoundedIcon sx={{ fontSize: '2.5rem', color: 'paper' }} />
            </Avatar>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="caption" component={'p'}>
              Total Created
            </Typography>
            <Typography variant="caption" component={'p'}>
              Total Joined
            </Typography>
            <Button
              size="small"
              variant="outlined"
              sx={{ fontSize: '10px', mt: 1 }}
              onClick={() =>
                navigate('/dashboard/view-all-requests', { replace: true })
              }
            >
              View Join Requests
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mt: 2 }}>
        <Chip size="small" label="COMMUNITIES" />
      </Divider>

      <Box sx={{ mt: 5 }}>
        <Grid container alignItems={'center'}>
          <Grid item xs={4}>
            <Avatar
              sx={{
                bgcolor: '#090979',
                width: '4rem',
                height: '4rem',
                color: 'paper',
              }}
            >
              <RateReviewRoundedIcon
                sx={{ fontSize: '2rem', color: 'paper' }}
              />
            </Avatar>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="caption" component={'p'}>
              Total Created
            </Typography>
            <Typography variant="caption" component={'p'}>
              Total Interacted
            </Typography>
            <Button
              size="small"
              variant="outlined"
              sx={{ fontSize: '10px', mt: 1 }}
            >
              View Join Requests
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mt: 2 }}>
        <Chip size="small" label="THREADS" />
      </Divider>

      {/* {[1, 2, 3].map((el) => {
        return (
          <>
            <Card
              key={el}
              sx={{
                minHeight: '100px',
                bgcolor: 'secondary.dark',
                my: 2,
                color: 'primary.dark',
                p: 5,
              }}
            >
              Coming Soon #1
            </Card>
          </>
        );
      })} */}
    </Box>
  );
};

export default SecondarySidebar;
