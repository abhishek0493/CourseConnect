import React, { useState } from 'react';
import {
  Typography,
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
} from '@mui/material';

import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownOffAltTwoToneIcon from '@mui/icons-material/ThumbDownOffAltTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { styled } from '@mui/system';

const Indentation = styled(Box)(({ theme }) => ({
  borderLeft: `1.5px solid ${theme.palette.divider}`,
  paddingLeft: '1rem',
}));

const CommentItem = ({ comment }) => {
  const [showNestedComments, setShowNestedComments] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleToggleNestedComments = () => {
    setShowNestedComments((prevShowNested) => !prevShowNested);
  };

  const handleReplyButtonClick = () => {
    setShowReplyBox((prevShowReply) => !prevShowReply);
  };

  const handleSubmitReply = (event) => {
    event.preventDefault();
    // Add your logic to handle the reply submission here
    // You can send the reply to the backend or handle it locally
    // Reset the reply box state after submission
    setShowReplyBox(false);
  };

  const renderReplyBox = () => {
    if (showReplyBox) {
      return (
        <form onSubmit={handleSubmitReply}>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
              {/* Replace with the logged-in user's avatar */}
              {comment.author && comment.author.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1, ml: '0.5rem' }}>
              <TextField
                id="outlined-basic"
                multiline
                fullWidth
                rows={4}
                label="Post a reply.."
                variant="outlined"
              />
            </Box>
            <Button type="submit" size="small">
              Reply
            </Button>
          </Box>
        </form>
      );
    } else {
      return null;
    }
  };

  const renderActionBox = () => {
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
            onClick={handleReplyButtonClick}
          >
            <ReplyAllRoundedIcon color="success" fontSize="1rem" />
          </IconButton>
        </Box>
      </>
    );
  };

  const renderNestedComments = (comments, depth) => {
    if (!showNestedComments && depth >= 3) {
      return null;
    }

    return comments.map((el) => (
      <React.Fragment key={el.id}>
        <Indentation>
          <Box sx={{ ml: 1, my: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
              }}
            >
              <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
                {el.author && el.author.charAt(0)}
              </Avatar>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ ml: '0.5rem' }}
              >
                {el.author}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: '0.5rem' }}>
              {el.comment}
            </Typography>
            {renderActionBox()}
            {el.comments.length > 0 && (
              <>
                {renderNestedComments(el.comments, depth + 1)}
                {depth === 2 && (
                  <Button size="small" onClick={handleToggleNestedComments}>
                    {showNestedComments ? 'Hide Replies' : 'Show More Replies'}
                  </Button>
                )}
              </>
            )}
          </Box>
        </Indentation>
      </React.Fragment>
    ));
  };

  return (
    <Box sx={{ ml: 0.5, my: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
        }}
      >
        <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
          {comment.author && comment.author.charAt(0)}
        </Avatar>
        <Typography variant="body2" color="textSecondary" sx={{ ml: '0.5rem' }}>
          {comment.author}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: '0.5rem' }}>
        {comment.comment}
      </Typography>
      {renderActionBox()}
      {renderNestedComments(comment.comments, 1)}
      {renderReplyBox()}
    </Box>
  );
};

export default CommentItem;
