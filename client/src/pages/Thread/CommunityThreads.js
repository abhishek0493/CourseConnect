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

const CommunityThreads = ({ title, author, score, comments }) => {
  return (
    <Box>
      <Stack spacing={2}>
        {[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
          (element) => {
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
                        {author.charAt(0)}
                      </Avatar>
                    }
                    title={title}
                    subheader={`Posted by u/${author}`}
                  />
                  <CardContent>
                    <Typography variant="body1" color="text.secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aenean auctor, dolor ut tempus iaculis, massa magna mollis
                      erat, et commodo nisi sem eu nisl. Vivamus auctor lobortis
                      ex at luctus. Integer nec augue dapibus, posuere ipsum id,
                      consequat odio.
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Score: {score} | Comments: {comments}
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
          }
        )}
      </Stack>
    </Box>
  );
};

export default CommunityThreads;
