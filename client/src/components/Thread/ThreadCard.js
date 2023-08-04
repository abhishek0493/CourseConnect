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
  Rating,
  Tooltip,
  Chip,
} from '@mui/material';

import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';

import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';

import axios from 'axios';
import { FormatCount } from '../Constants/RefactorCount';

const ThreadCard = ({
  thread,
  upVoteTrigger,
  downVoteTrigger,
  saveTrigger,
}) => {
  const navigate = useNavigate();
  const savedColour = thread.is_saved ? 'green' : '';
  const savedText = thread.is_saved ? 'Saved' : 'Save';

  const upVoteColor = thread.is_upvoted == 1 ? 'green' : '';
  const downVoteColor = thread.is_downvoted == 1 ? 'orangered' : '';

  const handleUpVote = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${thread.id}/up-vote-thread`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          upVoteTrigger(thread.id, res.data.data.toggle);
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
          downVoteTrigger(thread.id, res.data.data.toggle);
        }
      })
      .catch((err) => {
        const res = err.response;
        alert(res.data.message);
        console.log(err);
      });
  };

  const handleSave = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${thread.id}/save`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          saveTrigger(thread.id, res.data.data.toggle);
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
          // borderLeft: thread.type == 1 ? `4px solid orangered` : ``,
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
                  <ArrowCircleUpTwoToneIcon htmlColor={upVoteColor} />
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
                  <ArrowCircleDownTwoToneIcon htmlColor={downVoteColor} />
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
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '0.5px solid #e3e3e3',
              }}
            >
              <Box sx={{ display: 'flex' }}>
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
                  {thread.thread_author.charAt(0)}
                </Avatar>
                <Typography
                  variant="caption"
                  fontWeight="light"
                  color="gray"
                  sx={{ mx: 1 }}
                >
                  Posted By
                  {thread.is_author == 1 ? (
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
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      u/{thread.thread_author}
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color={'gray'}>
                  {thread.created_at}
                </Typography>
              </Box>
              <Box>
                {thread.type == 1 && (
                  <>
                    <Tooltip title="Course thread">
                      <StarsRoundedIcon sx={{ mr: 0.5 }} />
                    </Tooltip>
                  </>
                )}
              </Box>
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
                    icon={<VerifiedRoundedIcon />}
                    size="small"
                    sx={{ mx: 1 }}
                    label="I have completed the course"
                  />
                  <Chip
                    icon={<LeaderboardRoundedIcon />}
                    size="small"
                    sx={{ mx: 1, alignItems: 'center' }}
                    label={`Rating ${thread.author_rating}/5`}
                  />
                  <Chip
                    icon={<LanguageRoundedIcon />}
                    label={thread.link}
                    size="small"
                    sx={{ my: 1 }}
                    onClick={() => {
                      alert(thread.link);
                    }}
                  />
                </>
              )}
            </CardContent>
            <Box
              sx={{
                display: 'flex',
                p: 1,
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
                    <MarkChatUnreadIcon sx={{ fontSize: '1.2rem' }} />
                    <Typography
                      variant="caption"
                      sx={{ mx: 1, color: '#333333' }}
                    >
                      {thread.total_comments} Comments
                    </Typography>
                  </IconButton>
                  <IconButton sx={{ borderRadius: 2 }} onClick={handleSave}>
                    <BookmarkIcon
                      sx={{ fontSize: '1.2rem' }}
                      htmlColor={savedColour}
                    />
                    <Typography
                      variant="caption"
                      sx={{ mx: 1, color: '#333333' }}
                    >
                      {savedText}
                    </Typography>
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ThreadCard;
