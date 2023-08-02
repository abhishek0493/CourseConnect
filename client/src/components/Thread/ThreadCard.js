import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';

import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import MarkChatUnreadTwoToneIcon from '@mui/icons-material/MarkChatUnreadTwoTone';
import ParentContext from '../../ParentContext';
import axios from 'axios';
import { FormatCount } from '../Constants/RefactorCount';

const ThreadCard = ({ thread, upVoteTrigger, downVoteTrigger }) => {
  const navigate = useNavigate();
  const user = useContext(ParentContext);

  const handleUpVote = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${thread.id}/up-vote-thread`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          upVoteTrigger(thread.id);
        }
      })
      .catch((err) => {
        const res = err.response;
        alert(res.data.message);
        console.log(err);
      });
  };

  const handleDownVote = async () => {
    await axios
      .get(
        `http://localhost:8000/api/v1/threads/${thread.id}/down-vote-thread`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          downVoteTrigger(thread.id);
        }
      })
      .catch((err) => {
        const res = err.response;
        alert(res.data.message);
        console.log(err);
      });
  };

  return (
    <>
      <Card
        key={thread.id}
        sx={{
          borderLeft: thread.type == 1 ? `4px solid orangered` : ``,
          display: 'flex',
        }}
        variant="outlined"
      >
        {/* Left vertical strip */}
        <Grid container>
          <Grid item xs={0.6}>
            <Box
              sx={{
                height: '100%',
                bgcolor: 'secondary.light',
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}
            >
              <Box textAlign={'center'}>
                <IconButton
                  size="small"
                  onClick={handleUpVote}
                  sx={{
                    m: 0,
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ArrowCircleUpTwoToneIcon />
                </IconButton>
                <Typography variant="caption" fontWeight={'bold'}>
                  {FormatCount(thread.total_upvotes)}
                </Typography>
              </Box>
              <Box textAlign={'center'}>
                <Typography variant="caption" fontWeight={'bold'}>
                  {FormatCount(thread.total_downvotes)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleDownVote}
                  sx={{
                    '&:hover': {
                      color: 'warning.main',
                    },
                  }}
                >
                  <ArrowCircleDownTwoToneIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          {/* Left vertical strip ends */}

          {/* Main body starts */}
          <Grid item xs={11.4}>
            <Box
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '0.5px solid #e3e3e3',
              }}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: '#2e2e78',
                  // border: '2px solid #2e2e78',
                  color: 'paper',
                  p: 1.5,
                }}
              >
                {thread.author.charAt(0)}
              </Avatar>
              <Typography
                variant="caption"
                fontWeight="light"
                color="gray"
                sx={{ mx: 1 }}
              >
                Posted By
                {thread.is_author === 1 ? (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.dark',
                      borderRadius: 4,
                      p: 0.5,
                      fontWeight: 'bold',
                    }}
                  >
                    You
                  </Typography>
                ) : (
                  <Typography variant="caption">u/{thread.author}</Typography>
                )}
              </Typography>
              <Typography variant="caption" color={'gray'}>
                {thread.created_at}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5 }}>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {thread.title}
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                {thread.body}
              </Typography>
              {thread.type == 1 && (
                <>
                  <Chip
                    label={thread.link}
                    sx={{ my: 1 }}
                    onClick={() => {
                      alert(thread.link);
                    }}
                  />
                </>
              )}
            </CardContent>
            <CardContent
              sx={{
                display: 'flex',
                p: 1.2,
                maxHeight: '3rem',
                borderTop: '1px solid #e3e3e3',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Box>
                  <IconButton
                    sx={{ borderRadius: 2 }}
                    onClick={() => {
                      navigate(
                        `/dashboard/c/${thread.name}/${thread.id}/comments`
                      );
                    }}
                  >
                    <MarkChatUnreadTwoToneIcon
                      sx={{ fontSize: '1.2rem', color: 'primary.main' }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ mx: 1, color: '#333333' }}
                    >
                      {thread.total_comments} Comments
                    </Typography>
                  </IconButton>
                  <IconButton
                    sx={{ borderRadius: 2 }}
                    onClick={() => {
                      navigate(
                        `/dashboard/c/${thread.name}/${thread.id}/comments`
                      );
                    }}
                  >
                    <BookmarkTwoToneIcon
                      sx={{ fontSize: '1.2rem' }}
                      htmlColor="green"
                    />
                    <Typography
                      variant="caption"
                      sx={{ mx: 1, color: '#333333' }}
                    >
                      Save
                    </Typography>
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ThreadCard;
