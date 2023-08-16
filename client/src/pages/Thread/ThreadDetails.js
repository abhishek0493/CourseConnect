import React, { useEffect, useState } from 'react';
import { Card, Typography, Box, Stack, Alert } from '@mui/material';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Refactor } from '../../components/Constants/Refactor';

import CreateCommentCard from '../../components/Comment/CreateCommentCard';
import CommentItem from '../../components/Comment/CommentItem';
import ThreadCard from '../../components/Thread/ThreadCard';

const url = process.env.REACT_APP_BACKEND_URL;

const ThreadDetails = () => {
  const { name, thread_id } = useParams();
  const [thread, setThread] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState({
    state: false,
    message: '',
  });

  const fetchthreadDetails = async () => {
    await axios.get(`${url}/api/v1/threads/${thread_id}`).then((res) => {
      const result = Refactor(res.data);
      setThread(result.thread);
      setComments(result.comments);
    });
  };

  useEffect(() => {
    fetchthreadDetails();
  }, []);

  const incrementUpvotes = (threadId, toggle) => {
    const updatedThread = (thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          total_upvotes: thread.total_upvotes + 1,
          total_downvotes: thread.total_downvotes - (toggle ? 1 : 0),
          is_upvoted: 1,
          is_downvoted: 0,
        };
      }
      return thread;
    };
    setThread(updatedThread);
    fetchthreadDetails();
  };

  const incrementDownvotes = (threadId, toggle) => {
    const updatedThread = (thread) => {
      if (thread.id === threadId) {
        return {
          total_downvotes: thread.total_downvotes + 1,
          total_upvotes: thread.total_upvotes - (toggle ? 1 : 0), // Decrement downvotes only if toggle is true
          is_downvoted: 1,
          is_upvoted: 0,
        };
      }
      return thread;
    };
    setThread(updatedThread);
    fetchthreadDetails();
  };

  const handleSave = (threadId, toggle) => {
    const updatedThread = (thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          is_saved: toggle ? (thread.is_saved ? 0 : 1) : 1,
        };
      }
      return thread;
    };
    setThread(updatedThread);
    fetchthreadDetails();
  };

  const handleCreateComment = async (comment) => {
    await axios
      .post(
        `${url}/api/v1/comments/${thread_id}`,
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
        // console.log(err);
      });
  };

  const handleSubmitReply = (reply, commentId) => {
    axios
      .post(
        `${url}/api/v1/comments/${thread_id}/${commentId}`,
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

  const commentActionTrigger = (val) => {
    if (val) {
      fetchthreadDetails();
    }
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
        <ThreadCard
          thread={thread}
          isDetails={true}
          upVoteTrigger={incrementUpvotes}
          downVoteTrigger={incrementDownvotes}
          saveTrigger={handleSave}
        />
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
                updateComments={commentActionTrigger}
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
