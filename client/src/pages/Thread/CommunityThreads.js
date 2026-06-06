import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import axios from 'axios';
import { MessagesSquare } from 'lucide-react';

import ThreadCard from '../../components/Thread/ThreadCard';
import { EmptyState } from '../../components/Common/EmptyState';
import ParentContext from '../../ParentContext';

const CommunityThreads = () => {
  const { name } = useParams();
  const [threads, setThreads] = useOutletContext();
  const { baseUrl } = useContext(ParentContext);
  const [access, setAccess] = useState(true);
  const location = useLocation();

  const checkCommunityAccess = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/community/${name}/check-access`, {
        withCredentials: true,
      });
      if (res.data.success) setAccess(res.data.access);
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
    checkCommunityAccess();
  }, [location]);

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="No threads yet"
        description="This community is quiet for now. Be the first to start a discussion!"
      />
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((item) => (
        <ThreadCard
          key={item.id}
          thread={item}
          isAccess={access}
          upVoteTrigger={incrementUpvotes}
          downVoteTrigger={incrementDownvotes}
          saveTrigger={handleSave}
        />
      ))}
    </div>
  );
};

export default CommunityThreads;
