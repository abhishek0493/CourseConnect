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

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Refactor } from '../../components/Constants/Refactor';

import CreateCommentCard from '../../components/Comment/CreateCommentCard';
import CommentItem from '../../components/Comment/CommentItem';

const ThreadDetails = () => {
  const { name, thread_id } = useParams();
  const [thread, setthread] = useState([]);
  const [comments, setcomments] = useState([]);

  const fetchthreads = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${thread_id}`)
      .then((res) => {
        const result = Refactor(res.data);
        setthread(result.thread);
        setcomments(result.comments);
      });
  };

  useEffect(() => {
    fetchthreads();
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
          fetchthreads();
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
                  {thread.creator && thread.creator.charAt(0)}
                </Avatar>
              }
              title={thread.title}
              subheader={`Posted by u/${thread.creator}`}
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
