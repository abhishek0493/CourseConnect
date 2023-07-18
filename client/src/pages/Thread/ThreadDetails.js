import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Grid,
  Alert,
  Chip,
} from '@mui/material';

import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import { styled } from '@mui/system';
import CreateCommentCard from '../../components/Common/CreateCommentCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Refactor } from '../../components/Constants/Refactor';

const Indentation = styled(Box)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.divider}`,
  paddingLeft: '1rem',
}));

const comments = [
  {
    id: 1,
    author: 'user1',
    timestamp: '2 hours ago',
    text: 'This is the first comment.',
    replies: [
      {
        id: 11,
        author: 'user2',
        timestamp: '1 hour ago',
        text: 'Reply to the first comment.',
        replies: [
          {
            id: 111,
            author: 'user1',
            timestamp: '30 minutes ago',
            text: 'Reply to the reply.',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    author: 'user3',
    timestamp: '1 day ago',
    text: 'This is the second comment.',
    replies: [],
  },
  {
    id: 3,
    author: 'user4',
    timestamp: '3 days ago',
    text: 'This is the third comment.',
    replies: [
      {
        id: 31,
        author: 'user2',
        timestamp: '2 days ago',
        text: 'Reply to the third comment.',
        replies: [],
      },
    ],
  },
];

const CommentItem = ({ comment }) => {
  return (
    <Box sx={{ marginLeft: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem',
          p: 1,
        }}
      >
        <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
          {comment.author.charAt(0)}
        </Avatar>
        <Typography variant="body2" fontWeight="bold" sx={{ ml: '0.5rem' }}>
          {comment.author}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ ml: '0.5rem' }}>
          {comment.timestamp}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: '0.5rem' }}>
        {comment.text}
      </Typography>
      <Box sx={{ paddingLeft: '2rem' }}>
        <Indentation>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </Indentation>
      </Box>
    </Box>
  );
};

const ThreadDetails = () => {
  const { name, thread_id } = useParams();
  const [threadDetail, setThreadDetail] = useState([]);
  const fetchThreadDetails = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${thread_id}`)
      .then((res) => {
        const result = Refactor(res.data);
        setThreadDetail(result);
      });
  };

  useEffect(() => {
    fetchThreadDetails();
  }, []);

  const handleCreateComment = async (comment) => {
    await axios
      .post(
        `http://localhost:8000/api/v1/threads/${comment}`,
        { comment: comment },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const thread = {
    id: 1,
    author: 'user1',
    timestamp: '2 hours ago',
    text: 'This is the main thread comment.',
    replies: [
      {
        id: 11,
        author: 'user2',
        timestamp: '1 hour ago',
        text: 'Reply to the main thread comment.',
        replies: [
          {
            id: 111,
            author: 'user1',
            timestamp: '30 minutes ago',
            text: 'Reply to the reply.',
            replies: [],
          },
        ],
      },
    ],
  };

  return (
    <Box>
      <Card
        key={thread.id}
        sx={{
          borderLeft: thread.type === 1 ? `4px solid orangered` : ``,
          display: 'flex',
        }}
        variant="outlined"
      >
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
              <Box>
                <ThumbUpAltOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                <Typography variant="caption">232</Typography>
              </Box>
              <Box>
                <Typography variant="caption">232</Typography>
                <ThumbDownOffAltOutlinedIcon sx={{ fontSize: '1.2rem' }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={11.4}>
            <CardHeader
              avatar={
                <Avatar sx={{ color: 'action.main' }}>
                  {thread.author.charAt(0)}
                </Avatar>
              }
              title={thread.title}
              subheader={`Posted by u/${thread.author}`}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                {thread.body}
              </Typography>
              {thread.type === 1 && (
                <Chip
                  label={thread.link}
                  onClick={() => {
                    console.log('Hello');
                  }}
                />
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
              <Box>
                <QuestionAnswerRoundedIcon
                  sx={{ fontSize: '1.2rem' }}
                  htmlColor="#333333"
                />
                <Typography variant="caption" sx={{ mx: 1, color: '#333333' }}>
                  23 Comments
                </Typography>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Stack spacing={2} sx={{ marginTop: '2rem' }}>
        <Box>
          <CreateCommentCard onSubmit={handleCreateComment} />
        </Box>
        <Typography variant="h6" fontWeight="bold">
          Comments
        </Typography>

        <Card sx={{ p: 2 }}>
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
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
