import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';

import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownOffAltTwoToneIcon from '@mui/icons-material/ThumbDownOffAltTwoTone';
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import MarkChatUnreadTwoToneIcon from '@mui/icons-material/MarkChatUnreadTwoTone';
// import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
// import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
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
                p: 1,
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
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ThumbUpAltTwoToneIcon
                    sx={{
                      fontSize: '1.2rem',
                    }}
                  />
                </IconButton>
                <Typography variant="caption">
                  {FormatCount(thread.total_upvotes)}
                </Typography>
              </Box>
              <Box textAlign={'center'}>
                <Typography variant="caption">
                  {FormatCount(thread.total_downvotes)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleDownVote}
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ThumbDownOffAltTwoToneIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          {/* Left vertical strip ends */}

          {/* Main body starts */}
          <Grid item xs={11.4}>
            <CardHeader
              avatar={
                <Avatar sx={{ color: 'action.main' }}>
                  {thread.author.charAt(0)}
                </Avatar>
              }
              title={thread.title}
              subheader={
                thread.is_author === 1 ? (
                  <Typography variant="caption">
                    Posted by
                    <Chip
                      label="You"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                ) : (
                  <Typography variant="caption">
                    Posted by {thread.author}
                  </Typography>
                )
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                {thread.body}
              </Typography>
              {thread.type == 1 && (
                <>
                  <Chip
                    label={thread.link}
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
