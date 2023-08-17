import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Divider, Typography, Box, Alert, Stack } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import ParentContext from '../../ParentContext';
import { Refactor } from '../../components/Constants/Refactor';
import axios from 'axios';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const SearchResults = ({ updateTrigger }) => {
  const { baseUrl } = useContext(ParentContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  const [threads, setThreads] = useState([]);

  const fetchThreadResults = async () => {
    axios
      .get(`${baseUrl}/api/v1/dashboard/search-threads?query=${query}`)
      .then((res) => {
        if (res.data.success) {
          const response = Refactor(res.data);
          const resWithIcons = AddCategoryIcon(response);
          setThreads(resWithIcons);
        }
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
          total_upvotes: thread.total_upvotes - (toggle ? 1 : 0),
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
    fetchThreadResults();
  }, [location]);

  return (
    <>
      <Divider textAlign="left">
        <Typography variant="subtitle2" fontWeight={'bold'}>
          Search Results for "{query}"
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
    </>
  );
};

export default SearchResults;
