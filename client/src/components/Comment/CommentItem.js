import React, { useState } from 'react';
import { Typography, Avatar, Box, Button } from '@mui/material';
import { styled } from '@mui/system';

import ReplyBox from './ReplyBox';
import ActionBox from './ActionBox';

const Indentation = styled(Box)(({ theme }) => ({
  borderLeft: `1.5px solid ${theme.palette.divider}`,
  paddingLeft: '1rem',
}));

const CommentItem = ({ comment, handleSubmitReply, updateComments }) => {
  const [showNestedComments, setShowNestedComments] = useState(false);
  const [showReplyBoxId, setShowReplyBoxId] = useState(null);

  const handleReplyButtonClick = (commentId) => {
    setShowReplyBoxId((prevId) => (prevId === commentId ? null : commentId));
  };

  const handleToggleNestedComments = () => {
    setShowNestedComments((prevShowNested) => !prevShowNested);
  };

  const handleCommentUpdate = (commentId) => {
    updateComments(true);
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
              <Avatar
                sx={{
                  width: '1.5rem',
                  height: '1.5rem',
                  bgcolor: 'primary.dark',
                }}
              >
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
            <Typography variant="body2" sx={{ mb: '0.5rem' }}>
              {el.comment}
            </Typography>
            <ActionBox
              commentId={el.id}
              comment={el}
              handleReplyButtonClick={handleReplyButtonClick}
              upVoteTrigger={handleCommentUpdate}
              downVoteTrigger={handleCommentUpdate}
            />
            {el.id === showReplyBoxId && (
              <ReplyBox commentId={el.id} onSubmit={handleSubmitReply} />
            )}

            {el.comments.length > 0 && (
              <>
                {renderNestedComments(el.comments, depth + 1)}
                {depth === 2 && (
                  <Button
                    size="small"
                    onClick={handleToggleNestedComments}
                    sx={{ fontSize: '12px', textTransform: 'Capitalize' }}
                  >
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
        <Avatar
          sx={{
            width: '1.5rem',
            height: '1.5rem',
            bgcolor: 'primary.dark',
          }}
        >
          {comment.author && comment.author.charAt(0)}
        </Avatar>
        <Typography variant="body2" color="textSecondary" sx={{ ml: '0.5rem' }}>
          {comment.author}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: '0.5rem' }}>
        {comment.comment}
      </Typography>
      <ActionBox
        commentId={comment.id}
        comment={comment}
        handleReplyButtonClick={handleReplyButtonClick}
        upVoteTrigger={handleCommentUpdate}
        downVoteTrigger={handleCommentUpdate}
      />
      {renderNestedComments(comment.comments, 1)}
      {comment.id === showReplyBoxId && (
        <ReplyBox commentId={comment.id} onSubmit={handleSubmitReply} />
      )}
    </Box>
  );
};

export default CommentItem;
