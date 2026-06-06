import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bookmark } from 'lucide-react';

import CreatePostBar from '../../components/Common/CreatePostBar';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { SectionHeading } from '../../components/Common/SectionHeading';
import { EmptyState } from '../../components/Common/EmptyState';
import ParentContext from '../../ParentContext';
import { Refactor } from '../../components/Constants/Refactor';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const SavedThreads = ({ updateTrigger }) => {
  const { baseUrl } = useContext(ParentContext);
  const [threads, setThreads] = useState([]);

  const fetchSavedThreads = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/dashboard/get-saved-threads`);
      if (res.data.success) setThreads(AddCategoryIcon(Refactor(res.data)));
    } catch {
      /* noop */
    }
  };

  const incrementUpvotes = (threadId, toggle) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, total_upvotes: t.total_upvotes + 1, total_downvotes: t.total_downvotes - (toggle ? 1 : 0), is_upvoted: 1, is_downvoted: 0 } : t)));
  const incrementDownvotes = (threadId, toggle) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, total_downvotes: t.total_downvotes + 1, total_upvotes: t.total_upvotes - (toggle ? 1 : 0), is_downvoted: 1, is_upvoted: 0 } : t)));
  const handleSave = (threadId, toggle) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, is_saved: toggle ? (t.is_saved ? 0 : 1) : 1 } : t)));

  useEffect(() => {
    fetchSavedThreads();
  }, []);

  return (
    <div className="space-y-6">
      <CreatePostBar />
      <SectionHeading icon={Bookmark}>Saved Threads</SectionHeading>
      {threads.length === 0 ? (
        <EmptyState icon={Bookmark} title="Nothing saved yet" description="Threads you bookmark will show up here." />
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

export default SavedThreads;
