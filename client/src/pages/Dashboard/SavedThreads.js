import React, { useContext, useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Box, Divider, Typography, Alert, Stack } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import axios from 'axios';
import ParentContext from '../../ParentContext';
import { Refactor } from '../../components/Constants/Refactor';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const SavedThreads = ({ updateTrigger }) => {
  const { baseUrl } = useContext(ParentContext);
  const [threads, setThreads] = useState([]);

  const fetchSavedThreads = async () => {
    await axios
      .get(`${baseUrl}/api/v1/dashboard/get-saved-threads`)
      .then((res) => {
        if (res.data.success) {
          const response = Refactor(res.data);
          const resWithIcons = AddCategoryIcon(response);
          setThreads(resWithIcons);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
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
    fetchSavedThreads();
  }, []);

  return (
    <>
      <CreatePostBar />
      <Box sx={{ mt: 2 }}>
        <Divider textAlign="left">
          <Typography variant="h5" fontWeight={'bold'}>
            # Saved Threads
          </Typography>
        </Divider>
        <Box sx={{ mt: 2 }}>
          {threads.length === 0 ? (
            <>
              <Alert severity="warning" icon={<InfoOutlined />}>
                No Results found.
              </Alert>
            </>
          ) : (
            <Stack spacing={2}>
              {threads.map((item) => (
                <DashboardThreads
                  thread={item}
                  upVoteTrigger={incrementUpvotes}
                  downVoteTrigger={incrementDownvotes}
                  saveTrigger={handleSave}
                  isCommunityJoined={updateTrigger}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SavedThreads;
