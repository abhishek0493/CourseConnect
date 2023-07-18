import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Grid,
  IconButton,
  Alert,
  Chip,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Comment,
  InfoOutlined,
  Face,
} from '@mui/icons-material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import { useNavigate, useOutletContext } from 'react-router-dom';
import image from './empty2.svg';

const CommunityThreads = () => {
  const navigate = useNavigate();
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
            style={{
              width: '55%',
              display: 'block',
              margin: '0 auto',
            }}
          ></img>
        </>
      ) : (
        <Stack spacing={2}>
          {threads.map((item) => (
            <Card
              key={item.id}
              sx={{
                borderLeft: item.type == 1 ? `4px solid orangered` : ``,
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
                      <ThumbDownOffAltOutlinedIcon
                        sx={{ fontSize: '1.2rem' }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={11.4}>
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ my: 1 }}
                    >
                      {item.body}
                    </Typography>
                    {item.type == 1 && (
                      <>
                        <Chip
                          label={item.link}
                          onClick={() => {
                            console.log('Hello');
                          }}
                        />
                      </>
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
                      <IconButton
                        sx={{ borderRadius: 2 }}
                        onClick={() => {
                          navigate(
                            `/dashboard/c/${item.name}/${item.id}/comments`
                          );
                        }}
                      >
                        <QuestionAnswerRoundedIcon
                          sx={{ fontSize: '1.2rem' }}
                          htmlColor="#333333"
                        />
                        <Typography
                          variant="caption"
                          sx={{ mx: 1, color: '#333333' }}
                        >
                          23 Comments
                        </Typography>
                      </IconButton>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommunityThreads;
