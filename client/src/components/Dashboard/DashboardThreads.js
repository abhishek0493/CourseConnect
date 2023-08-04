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
import MarkChatUnreadTwoToneIcon from '@mui/icons-material/MarkChatUnreadTwoTone';
import OutboundRoundedIcon from '@mui/icons-material/OutboundRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';

import { FormatCount } from '../Constants/RefactorCount';
import { useNavigate } from 'react-router-dom';
import { getAccessIcon } from '../Constants/GetAccessIcon';
import axios from 'axios';

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

const DashboardThreads = ({ thread }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { is_joined, is_request_pending } = thread;
  const label =
    is_joined === 1 ? 'Joined' : is_request_pending === 1 ? 'Pending' : 'Join';

  const accessIcon = getAccessIcon(thread.access_type);
  const communityIcon = thread.icon;

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
        const response = err.response.data;
        alert(response.message);
      });
  };

  return (
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
              bgcolor: 'secondary.main',
              py: 1,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <Box textAlign={'center'}>
              <IconButton
                size="small"
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
                Posted by {thread.author}
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
                <>
                  <Chip
                    icon={<LanguageRoundedIcon />}
                    label={thread.link}
                    sx={{ my: 1 }}
                    onClick={() => {
                      alert(thread.link);
                    }}
                  />
                </>
              )}
            </Box>
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
              </Box>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DashboardThreads;
