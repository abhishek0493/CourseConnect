import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  IconButton,
  Alert,
} from '@mui/material';
import { ThumbUp, ThumbDown, Comment, InfoOutlined } from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import image from './empty2.svg';

const CommunityThreads = () => {
  const [threads, setThreads] = useOutletContext();
  return (
    <Box>
      {threads.length === 0 ? (
        <>
          <Alert severity="warning" icon={<InfoOutlined />}>
            No threads created in this community yet!
          </Alert>
          <img
            src={image}
            style={{ width: '55%', display: 'block', margin: '0 auto' }}
          ></img>
        </>
      ) : (
        <Stack spacing={2}>
          {threads.map((item) => (
            <Card
              key={item.id}
              sx={{
                '&:hover': {
                  border: '1px solid orangered',
                },
              }}
              variant="outlined"
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ color: 'action.main' }}>
                    {item.author.charAt(0)}
                  </Avatar>
                }
                title={item.title}
                subheader={`Posted by u/${item.author}`}
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Score: {item.score} | Comments: {item.comments}
                </Typography>
              </CardContent>
              <CardContent>
                <IconButton size="small">
                  <ThumbUp />
                </IconButton>
                <IconButton size="small">
                  <ThumbDown />
                </IconButton>
                <IconButton size="small">
                  <Comment />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommunityThreads;
