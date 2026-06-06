import React, { useContext, useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

import axios from 'axios';
import CreatePostBar from '../../components/Common/CreatePostBar';
import FilterBar from '../../components/Dashboard/FilterBar';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import Communities from '../../components/Dashboard/Communities';
import { EmptyState } from '../../components/Common/EmptyState';
import { Refactor } from '../../components/Constants/Refactor';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';
import ParentContext from '../../ParentContext';

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

  const fetchTrendingThreads = (filters) => {
    let url = `${baseUrl}/api/v1/dashboard`;
    if (filters) {
      const queryParams = new URLSearchParams(filterState).toString();
      url = `${baseUrl}/api/v1/dashboard?${queryParams}`;
    }
    axios.get(url, { withCredentials: true }).then((res) => {
      if (res.data.success) {
        setThreads(AddCategoryIcon(Refactor(res.data)));
      }
    });
  };

  const fetchRecentCommunities = () => {
    axios
      .get(`${baseUrl}/api/v1/dashboard/get-recent-communities`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setCommunities(AddCategoryIcon(Refactor(res.data)));
        }
      });
  };

  const incrementUpvotes = (threadId, toggle) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, total_upvotes: t.total_upvotes + 1, total_downvotes: t.total_downvotes - (toggle ? 1 : 0), is_upvoted: 1, is_downvoted: 0 }
          : t
      )
    );

  const incrementDownvotes = (threadId, toggle) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, total_downvotes: t.total_downvotes + 1, total_upvotes: t.total_upvotes - (toggle ? 1 : 0), is_downvoted: 1, is_upvoted: 0 }
          : t
      )
    );

  const handleSave = (threadId, toggle) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, is_saved: toggle ? (t.is_saved ? 0 : 1) : 1 } : t
      )
    );

  const setFilter = (key) => (value) =>
    setFilterState((prev) => ({ ...prev, [key]: value }));

  const handleResetFilters = () =>
    setFilterState({ isSaved: 0, isCourse: 0, isAuthorPosted: 0, isCategory: 0 });

  useEffect(() => {
    fetchTrendingThreads(filterState);
  }, [filterState]);

  useEffect(() => {
    fetchRecentCommunities();
  }, []);

  return (
    <div className="space-y-6">
      <CreatePostBar />
      <Communities communities={communities} />
      <FilterBar
        handleSavedToggle={setFilter('isSaved')}
        handleFilterByCategory={setFilter('isCategory')}
        handleCourseToggle={setFilter('isCourse')}
        handlePostedToggle={setFilter('isAuthorPosted')}
        handleReset={handleResetFilters}
        filterState={filterState}
        title="Trending Threads"
      />

      {threads.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No popular threads found"
          description="Start a discussion or explore other communities!"
        />
      ) : (
        <div className="space-y-3">
          {threads.map((item) => (
            <DashboardThreads
              key={item.id}
              thread={item}
              upVoteTrigger={incrementUpvotes}
              downVoteTrigger={incrementDownvotes}
              saveTrigger={handleSave}
              isCommunityJoined={updateTrigger}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
