import React, { useContext, useState } from 'react';

import { Typography, Box, IconButton, Snackbar, Alert } from '@mui/material';
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';

import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';
import axios from 'axios';
import ParentContext from '../../ParentContext';

const ActionBox = ({
  commentId,
  handleReplyButtonClick,
  comment,
  upVoteTrigger,
  downVoteTrigger,
  isAccess,
}) => {
  const { baseUrl } = useContext(ParentContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpVote = async () => {
    await axios
      .get(`${baseUrl}/api/v1/comments/${commentId}/up-vote`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          upVoteTrigger(commentId);
        }
      })
      .catch((err) => {
        const res = err.response;
        if (res) {
          // console.log(res.data);
        }
        // console.log(err);
      });
  };

  const handleDownVote = async () => {
    await axios
      .get(`${baseUrl}/api/v1/comments/${commentId}/down-vote`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          downVoteTrigger(commentId);
        }
      })
      .catch((err) => {
        const res = err.response;
        if (res) {
          // console.log(res.data);
        }
        // console.log(err);
      });
  };

  return (
    <>
      <Box sx={{ mb: 2, color: 'primary.dark' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            You are not a member of this community yet
          </Alert>
        </Snackbar>
        <Typography variant="caption" sx={{ mr: 0.5, fontSize: '0.7rem' }}>
          {comment && comment.total_upvotes && (
            <span>{comment.total_upvotes}</span>
          )}
        </Typography>
        <IconButton
          size="small"
          aria-label="up-vote"
          sx={{ mr: 1, p: 0 }}
          onClick={isAccess == 'no-access' ? handleOpen : handleUpVote}
        >
          <ArrowCircleUpTwoToneIcon color="gray" sx={{ fontSize: '1.4rem' }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="down-vote"
          sx={{ p: 0 }}
          onClick={isAccess == 'no-access' ? handleOpen : handleDownVote}
        >
          <ArrowCircleDownTwoToneIcon
            color="gray"
            sx={{ mr: 0.5, fontSize: '1.4rem' }}
          />
        </IconButton>
        <Typography variant="caption" sx={{ mr: 1, fontSize: '0.7rem' }}>
          {comment && comment.total_downvotes && (
            <span>{comment.total_downvotes}</span>
          )}
        </Typography>
        <IconButton
          size="small"
          aria-label="Reply"
          disabled={isAccess == 'no-access'}
          onClick={() => {
            handleReplyButtonClick(commentId);
          }}
        >
          <ReplyAllRoundedIcon color="success" fontSize="1rem" />
        </IconButton>
      </Box>
    </>
  );
};

export default ActionBox;
