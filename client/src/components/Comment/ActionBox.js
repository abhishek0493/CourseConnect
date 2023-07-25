import React from 'react';

import { Typography, Box, IconButton } from '@mui/material';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownOffAltTwoToneIcon from '@mui/icons-material/ThumbDownOffAltTwoTone';
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';

const ActionBox = ({ commentId, handleReplyButtonClick }) => {
  return (
    <>
      <Box sx={{ mb: 2, color: 'primary.dark' }}>
        <Typography variant="caption" sx={{ mr: 0.5, fontSize: '0.7rem' }}>
          14
        </Typography>
        <IconButton size="small" aria-label="Reply">
          <ThumbUpAltTwoToneIcon
            color="primary"
            sx={{ fontSize: '1rem', mr: 1 }}
          />
        </IconButton>
        <IconButton size="small" aria-label="Reply">
          <ThumbDownOffAltTwoToneIcon
            color="primary"
            sx={{ fontSize: '1rem', mr: 0.5 }}
          />
        </IconButton>
        <Typography variant="caption" sx={{ mr: 1, fontSize: '0.7rem' }}>
          14
        </Typography>
        <IconButton
          size="small"
          aria-label="Reply"
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
