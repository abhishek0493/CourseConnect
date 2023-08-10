import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Tooltip,
  Modal,
  IconButton,
  Button,
  Chip,
} from '@mui/material';

import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import OutboundRoundedIcon from '@mui/icons-material/OutboundRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import BlockIcon from '@mui/icons-material/Block';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import { FormatCount } from '../Constants/RefactorCount';
import { useNavigate } from 'react-router-dom';
import { getAccessIcon } from '../Constants/GetAccessIcon';
import axios from 'axios';

import { formatDistanceToNow } from 'date-fns';

const HumanReadableDate = ({ date }) => {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  return <span>{formattedDate}</span>;
};

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const DashboardThreads = ({
  thread,
  upVoteTrigger,
  downVoteTrigger,
  saveTrigger,
}) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { is_joined, is_request_pending } = thread;
  const label =
    is_joined === 1 ? 'Joined' : is_request_pending === 1 ? 'Pending' : 'Join';

  const accessIcon = getAccessIcon(thread.access_type);
  const communityIcon = thread.icon;

  const savedColour = thread.is_saved ? 'green' : '';
  const savedText = thread.is_saved ? 'Saved' : 'Save';

  const upVoteColor = thread.is_upvoted == 1 ? 'green' : '';
  const downVoteColor = thread.is_downvoted == 1 ? 'orangered' : '';

  const handleJoin = async (id) => {
    await axios
      .get(`http://localhost:8000/api/v1/community/${id}/join`)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          alert(res.data.data.message);
          navigate(`/dashboard/c/${res.data.data.name}`);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          alert(response.data.message);
        }
        console.log(err);
      });
  };

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
    <Card
      key={thread.id}
      sx={{
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
              bgcolor: 'secondary.main',
              py: 1,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <Box textAlign={'center'}>
              <Tooltip
                title={
                  thread.is_joined || thread.is_author
                    ? 'Upvote Thread'
                    : 'Join community to up-vote'
                }
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={handleUpVote}
                    disabled={thread.is_joined == 0 && thread.is_author == 0}
                    sx={{
                      m: 0,
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <ArrowCircleUpTwoToneIcon htmlColor={upVoteColor} />
                  </IconButton>
                </span>
              </Tooltip>

              <Typography variant="caption" fontWeight={'bold'}>
                {FormatCount(thread.total_upvotes)}
              </Typography>
            </Box>
            <Box textAlign={'center'}>
              <Typography variant="caption" fontWeight={'bold'}>
                {FormatCount(thread.total_downvotes)}
              </Typography>
              <Tooltip
                title={
                  thread.is_joined || thread.is_author
                    ? 'Downvote Thread'
                    : 'Join community to down-vote'
                }
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={handleDownVote}
                    disabled={thread.is_joined == 0 && thread.is_author == 0}
                    sx={{
                      '&:hover': {
                        color: 'warning.main',
                      },
                    }}
                  >
                    <ArrowCircleDownTwoToneIcon htmlColor={downVoteColor} />
                  </IconButton>
                </span>
              </Tooltip>
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
              justifyContent: 'space-between',
              borderBottom: '0.5px solid #e3e3e3',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: 'primary.main',
                  color: 'paper',
                  p: 1.5,
                }}
              >
                {communityIcon}
              </Avatar>
              <Typography variant="caption" sx={{ mx: 1, fontWeight: 'bold' }}>
                c/{thread.community_name}.
              </Typography>
              <Typography variant="caption" fontWeight="light" color="gray">
                Posted by {thread.author}.
              </Typography>
              <Typography
                variant="caption"
                fontWeight="light"
                color={'GrayText'}
                sx={{ ml: 1 }}
              >
                <HumanReadableDate date={thread.created_at} />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              {thread.type == 1 ? (
                <>
                  <Tooltip title="Course thread">
                    <StarsRoundedIcon sx={{ mr: 0.5 }} />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Comment Thread">
                    <ForumRoundedIcon sx={{ mr: 0.5 }} />
                  </Tooltip>
                </>
              )}
              <Tooltip title={accessIcon.message}>
                <Chip
                  label={accessIcon.type}
                  icon={accessIcon.icon}
                  size="small"
                  sx={{ p: 0, mr: 1 }}
                  color={accessIcon.color}
                ></Chip>
              </Tooltip>

              {thread.is_creator != 1 ? (
                <>
                  <Tooltip title={label}>
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent the event from bubbling up to the parent elements
                        handleOpen();
                      }}
                    >
                      <OutboundRoundedIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h5"
                        component="h2"
                      >
                        {thread.community_name}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {accessIcon.message}
                      </Typography>
                      <Button
                        variant="contained"
                        key={thread.id}
                        size="small"
                        sx={{ my: 2 }}
                        onClick={() => {
                          handleJoin(thread.community_id);
                        }}
                      >
                        {label}
                      </Button>
                    </Box>
                  </Modal>
                </>
              ) : (
                <Tooltip title="Community is created by you">
                  <PersonPinIcon sx={{ color: 'primary.main' }} />
                </Tooltip>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              p: 1,
            }}
          >
            <Typography variant="body1">{thread.title}</Typography>
          </Box>
          <CardContent>
            <Box sx={{ p: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                {thread.body}
              </Typography>
              {thread.type == 1 && (
                <Box sx={{ mt: 2 }}>
                  {thread.is_course_completed ? (
                    <Chip
                      icon={<VerifiedRoundedIcon />}
                      size="small"
                      sx={{ mx: 1 }}
                      label="I have completed this course"
                    />
                  ) : (
                    <Chip
                      icon={<GppMaybeRoundedIcon />}
                      size="small"
                      sx={{ mx: 1 }}
                      label="I have not completed this course"
                    />
                  )}
                  <Chip
                    icon={<LeaderboardRoundedIcon />}
                    size="small"
                    sx={{ mx: 1, alignItems: 'center' }}
                    label={`Rating ${thread.author_rating}/5`}
                  />
                  <Chip
                    icon={<RequestQuoteIcon />}
                    size="small"
                    sx={{ mx: 1 }}
                    label={
                      thread.pricing == 1 ? 'Pricing: Free' : 'Pricing: Paid'
                    }
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
                </Box>
              )}
            </Box>
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
                <Tooltip
                  title={
                    thread.is_joined || thread.is_author
                      ? 'Save Thread'
                      : 'Join community to save this thread'
                  }
                >
                  <span>
                    <IconButton
                      sx={{ borderRadius: 2 }}
                      onClick={handleSave}
                      disabled={thread.is_joined == 0 && thread.is_author == 0}
                    >
                      {thread.is_joined == 0 && thread.is_author == 0 && (
                        <BlockIcon sx={{ fontSize: '1.2rem' }} />
                      )}
                      {thread.is_joined == 1 ||
                        (thread.is_author == 1 && (
                          <BookmarkIcon
                            sx={{ fontSize: '1.2rem' }}
                            htmlColor={savedColour}
                          />
                        ))}
                      {thread.is_joined == 1 && thread.is_author == 0 && (
                        <BookmarkIcon
                          sx={{ fontSize: '1.2rem' }}
                          htmlColor={savedColour}
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{ mx: 1, color: '#333333' }}
                      >
                        {savedText}
                      </Typography>
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DashboardThreads;
