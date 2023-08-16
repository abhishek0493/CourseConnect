import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  Avatar,
  LinearProgress,
} from '@mui/material';

import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Refactor } from '../Constants/Refactor';
import ParentContext from '../../ParentContext';

const SecondarySidebar = () => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  const fetchUserStats = async () => {
    await axios
      .get(`${baseUrl}/api/v1/users/get-stats`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          const result = Refactor(res.data);
          setUser(result[0]);
        }
      });
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <Box sx={{ height: '80vh', p: 3 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="body2" fontWeight={'bold'}>
          {user && Object.keys(user).length > 0 ? (
            <Box sx={{ display: 'flex' }}>
              <InsertEmoticonRoundedIcon sx={{ mr: 1, color: 'green' }} />
              <Typography variant="body2" fontWeight={'bold'}>
                u/{user.name}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
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
              Total Created: {user.total_communities_created}
            </Typography>
            <Typography variant="caption" component={'p'}>
              Total Joined: {user.total_communities_joined}
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
              Total Threads Created: {user.total_threads_created}
            </Typography>
            <Typography variant="caption" component={'p'}>
              Total Comments: {user.total_comments}
            </Typography>
            <Typography variant="caption" component={'p'}>
              Total Replies: {user.total_replies}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mt: 2 }}>
        <Chip size="small" label="INTERACTIONS" />
      </Divider>
    </Box>
  );
};

export default SecondarySidebar;
