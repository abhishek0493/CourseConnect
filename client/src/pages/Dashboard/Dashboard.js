import React, { useContext, useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Box, Alert, Stack } from '@mui/material';
import axios from 'axios';
import { Refactor } from '../../components/Constants/Refactor';
import FilterBar from '../../components/Dashboard/FilterBar';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';
import ParentContext from '../../ParentContext';
import Communities from '../../components/Dashboard/Communities';

const Dashboard = ({ updateTrigger }) => {
  const { baseUrl } = useContext(ParentContext);
  const [threads, setThreads] = useState([]);
  const [communities, setCommunities] = useState([]);

  const [filterState, setFilterState] = useState({
    isSaved: 0,
    isCourse: 0,
    isAuthorPosted: 0,
    isCategory: 0,
  });

  const [title, setTitle] = useState('Trending Threads');

  const fetchTrendingThreads = (filters) => {
    let url = `${baseUrl}/api/v1/dashboard`;
    if (filters) {
      const queryParams = new URLSearchParams(filterState).toString();
      url = `${baseUrl}/api/v1/dashboard?${queryParams}`;
    }

    axios.get(url, { withCredentials: true }).then((res) => {
      if (res.data.success) {
        const response = Refactor(res.data);
        const resWithIcons = AddCategoryIcon(response);
        setThreads(resWithIcons);
      }
    });
  };

  const fetchRecentCommunities = () => {
    axios
      .get(`${baseUrl}/api/v1/dashboard/get-recent-communities`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          const response = Refactor(res.data);
          const resWithIcons = AddCategoryIcon(response);
          setCommunities(resWithIcons);
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

  const handleShowSaveThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isSaved: value,
    }));
  };

  const handleShowCourseThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isCourse: value,
    }));
  };

  const handleShowPostedThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isAuthorPosted: value,
    }));
  };

  const handleShowCategoryThreads = (value) => {
    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      isCategory: value,
    }));
  };

  const handleResetFilters = () => {
    setFilterState({
      isSaved: 0,
      isCourse: 0,
      isAuthorPosted: 0,
      isCategory: 0,
    });
  };

  useEffect(() => {
    fetchTrendingThreads(filterState);
  }, [filterState]);

  useEffect(() => {
    fetchRecentCommunities();
  }, []);

  return (
    <>
      <CreatePostBar />
      <Communities communities={communities} />
      <FilterBar
        handleSavedToggle={handleShowSaveThreads}
        handleFilterByCategory={handleShowCategoryThreads}
        handleCourseToggle={handleShowCourseThreads}
        handlePostedToggle={handleShowPostedThreads}
        handleReset={handleResetFilters}
        filterState={filterState}
        title={title}
      />
      <Box sx={{ my: 2 }}>
        {threads.length === 0 ? (
          <>
            <Alert severity="warning">
              No popular threads found. Start a discussion or explore other
              communities!
            </Alert>
          </>
        ) : (
          <Stack spacing={2}>
            {threads.map((item) => (
              <DashboardThreads
                thread={item}
                upVoteTrigger={incrementUpvotes}
                downVoteTrigget={incrementDownvotes}
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

export default Dashboard;
