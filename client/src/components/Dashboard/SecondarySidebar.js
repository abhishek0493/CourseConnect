import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  Avatar,
  Badge,
  LinearProgress,
} from '@mui/material';

import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import NotificationImportantRoundedIcon from '@mui/icons-material/NotificationImportantRounded';
import BallotRoundedIcon from '@mui/icons-material/BallotRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';

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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                size="small"
                variant="outlined"
                sx={{ fontSize: '10px', mt: 1, mr: 1 }}
                onClick={() =>
                  navigate('/dashboard/view-all-requests', { replace: true })
                }
              >
                Join Requests
              </Button>
              <Badge
                badgeContent={user.total_requests}
                color="warning"
                sx={{ mt: 0.5 }}
                showZero
              >
                <NotificationImportantRoundedIcon color="primary" />
              </Badge>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mt: 3 }} textAlign="left">
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                size="small"
                variant="outlined"
                sx={{ fontSize: '10px', mt: 1, mr: 1 }}
                onClick={() =>
                  navigate('/dashboard/view-all-saved', { replace: true })
                }
              >
                My Saved Threads
              </Button>
              <Badge
                color="success"
                badgeContent={user.total_saved}
                sx={{ mt: 0.5 }}
                showZero
              >
                <BookmarkIcon color="primary" />
              </Badge>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mt: 3 }} textAlign="left">
        <Chip size="small" label="INTERACTIONS" />
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
              <BallotRoundedIcon sx={{ fontSize: '2rem', color: 'paper' }} />
            </Avatar>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="caption" component={'p'}>
              Upvotes Received: {user.total_upvotes}
            </Typography>
            <Typography variant="caption" component={'p'}>
              Downvotes Received: {user.total_downvotes}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mt: 3 }} textAlign="left">
        <Chip size="small" label="PROFILE STATS" />
      </Divider>
    </Box>
  );
};

export default SecondarySidebar;
