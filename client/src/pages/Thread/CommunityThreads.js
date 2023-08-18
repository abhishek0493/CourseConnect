import React, { useContext, useEffect, useState } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import image from './empty2.svg';
import ThreadCard from '../../components/Thread/ThreadCard';
import axios from 'axios';
import ParentContext from '../../ParentContext';

const CommunityThreads = () => {
  const { name } = useParams();
  const [threads, setThreads] = useOutletContext();
  const { baseUrl } = useContext(ParentContext);
  const [access, setAccess] = useState(true);
  const location = useLocation();

  const checkCommunityAccess = async () => {
    await axios
      .get(`${baseUrl}/api/v1/community/${name}/check-access`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setAccess(res.data.access);
        }
      })
      .catch((err) => {});
  };

  const incrementUpvotes = (threadId, toggle) => {
    const updatedThreads = threads.map((thread) => {
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
    });
    setThreads(updatedThreads);
  };

  const incrementDownvotes = (threadId, toggle) => {
    const updatedThreads = threads.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          total_downvotes: thread.total_downvotes + 1,
          total_upvotes: thread.total_upvotes - (toggle ? 1 : 0), // Decrement downvotes only if toggle is true
          is_downvoted: 1,
          is_upvoted: 0,
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
  };

  const handleSave = (threadId, toggle) => {
    const updatedThreads = threads.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          is_saved: toggle ? (thread.is_saved ? 0 : 1) : 1,
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
  };

  useEffect(() => {
    checkCommunityAccess();
  }, [location]);

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
            <ThreadCard
              thread={item}
              isAccess={access}
              upVoteTrigger={incrementUpvotes}
              downVoteTrigger={incrementDownvotes}
              saveTrigger={handleSave}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommunityThreads;
