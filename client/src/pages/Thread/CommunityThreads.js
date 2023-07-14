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
} from '@mui/material';
import { ThumbUp, ThumbDown, Comment } from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';

const CommunityThreads = () => {
  const [threads, setThreads] = useOutletContext();
  console.log(threads);
  return (
    <Box>
      <Stack spacing={2}>
        {threads.map((element) => {
          return (
            <>
              <Card
                sx={{
                  '&:hover': {
                    border: '1px solid orangered', // Replace 'red' with the desired border color
                  },
                }}
                variant="outlined"
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ color: 'action.main' }}>
                      {'Abhishek'.charAt(0)}
                    </Avatar>
                  }
                  title={element.title}
                  subheader={`Posted by u/${element.author}`}
                />
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {element.description}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Score: {'score'} | Comments: {'comments'}
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
            </>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CommunityThreads;
