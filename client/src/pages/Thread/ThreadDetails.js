import React, { useEffect, useState } from 'react';
import { Card, Typography, Box, Stack, Alert } from '@mui/material';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Refactor } from '../../components/Constants/Refactor';

import CreateCommentCard from '../../components/Comment/CreateCommentCard';
import CommentItem from '../../components/Comment/CommentItem';
import ThreadCard from '../../components/Thread/ThreadCard';

const ThreadDetails = () => {
  const { name, thread_id } = useParams();
  const [thread, setthread] = useState([]);
  const [comments, setcomments] = useState([]);
  const [commentError, setCommentError] = useState({
    state: false,
    message: '',
  });

  const fetchthreadDetails = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${thread_id}`)
      .then((res) => {
        const result = Refactor(res.data);
        setthread(result.thread);
        setcomments(result.comments);
      });
  };

  useEffect(() => {
    fetchthreadDetails();
  }, []);

  const handleCreateComment = async (comment) => {
    await axios
      .post(
        `http://localhost:8000/api/v1/comments/${thread_id}`,
        { comment: comment },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          fetchthreadDetails();
        }
      })
      .catch((err) => {
        const response = err.response;
        if (!response.data.success) {
          setCommentError({ state: true, message: response.data.message });
        }
        console.log(err);
      });
  };

  const handleSubmitReply = (reply, commentId) => {
    axios
      .post(
        `http://localhost:8000/api/v1/comments/${thread_id}/${commentId}`,
        { comment: reply },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          fetchthreadDetails();
          // console.log(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      <Typography
        sx={{ mb: 1, fontWeight: 'bold' }}
        variant="body1"
        color="action"
      >
        c/{name}
      </Typography>
      {thread ? (
        <ThreadCard thread={thread} isDetails={true} />
      ) : (
        <Typography>Loading thread details...</Typography>
      )}

      <Stack spacing={2} sx={{ marginTop: '2rem' }}>
        <Box>
          <CreateCommentCard
            onSubmit={handleCreateComment}
            commentError={commentError}
            onChange={(val) => {
              setCommentError({ state: val, message: '' });
            }}
          />
        </Box>
        <Typography variant="h6" fontWeight="bold">
          Comments
        </Typography>

        <Card sx={{ p: 2 }}>
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                handleSubmitReply={handleSubmitReply}
              />
            ))
          ) : (
            <Alert severity="info">No comments on this thread yet!</Alert>
          )}
        </Card>
      </Stack>
    </Box>
  );
};

export default ThreadDetails;
