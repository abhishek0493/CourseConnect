import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';

import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { SectionHeading } from '../../components/Common/SectionHeading';
import { EmptyState } from '../../components/Common/EmptyState';
import ParentContext from '../../ParentContext';
import { Refactor } from '../../components/Constants/Refactor';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const SearchResults = ({ updateTrigger }) => {
  const { baseUrl } = useContext(ParentContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [threads, setThreads] = useState([]);

  const fetchThreadResults = () => {
    axios
      .get(`${baseUrl}/api/v1/dashboard/search-threads?query=${query}`)
      .then((res) => {
        if (res.data.success) setThreads(AddCategoryIcon(Refactor(res.data)));
      });
  };

  const incrementUpvotes = (threadId, toggle) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, total_upvotes: t.total_upvotes + 1, total_downvotes: t.total_downvotes - (toggle ? 1 : 0), is_upvoted: 1, is_downvoted: 0 } : t)));
  const incrementDownvotes = (threadId, toggle) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, total_downvotes: t.total_downvotes + 1, total_upvotes: t.total_upvotes - (toggle ? 1 : 0), is_downvoted: 1, is_upvoted: 0 } : t)));
  const handleSave = (threadId, toggle) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, is_saved: toggle ? (t.is_saved ? 0 : 1) : 1 } : t)));

  useEffect(() => {
    fetchThreadResults();
  }, [location]);

  return (
    <div className="space-y-6">
      <SectionHeading icon={Search} subtitle={`Showing threads matching your query`}>
        Results for “{query}”
      </SectionHeading>
      {threads.length === 0 ? (
        <EmptyState icon={Search} title="No results found" description="Try a different keyword or explore communities." />
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

export default SearchResults;
