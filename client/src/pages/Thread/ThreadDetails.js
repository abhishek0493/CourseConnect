import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';

import { Refactor } from '../../components/Constants/Refactor';
import CreateCommentCard from '../../components/Comment/CreateCommentCard';
import CommentItem from '../../components/Comment/CommentItem';
import ThreadCard from '../../components/Thread/ThreadCard';
import { Card } from '../../components/ui/card';
import { Alert } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import ParentContext from '../../ParentContext';

const ThreadDetails = () => {
  const { baseUrl } = useContext(ParentContext);
  const { name, thread_id } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState({ state: false, message: '' });

  const fetchthreadDetails = async () => {
    const res = await axios.get(`${baseUrl}/api/v1/threads/${thread_id}`);
    const result = Refactor(res.data);
    setThread(result.thread);
    setComments(result.comments);
  };

  useEffect(() => {
    fetchthreadDetails();
  }, []);

  const refresh = () => fetchthreadDetails();

  const handleCreateComment = async (comment) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/comments/${thread_id}`,
        { comment },
        { withCredentials: true }
      );
      if (res.data.success) refresh();
    } catch (err) {
      setCommentError({ state: true, message: err?.response?.data?.message || 'Failed to comment.' });
    }
  };

  const handleSubmitReply = (reply, commentId) => {
    axios
      .post(
        `${baseUrl}/api/v1/comments/${thread_id}/${commentId}`,
        { comment: reply },
        { withCredentials: true }
      )
      .then((res) => res.data.success && refresh())
      .catch(() => {});
  };

  return (
    <div className="space-y-5">
      {thread ? (
        <ThreadCard thread={thread} isDetails upVoteTrigger={refresh} downVoteTrigger={refresh} saveTrigger={refresh} />
      ) : (
        <Card className="p-5 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </Card>
      )}

      <CreateCommentCard
        isAccess={thread && thread.is_access ? 'access' : 'no-access'}
        onSubmit={handleCreateComment}
        commentError={commentError}
        onChange={(val) => setCommentError({ state: val, message: '' })}
      />

      <div className="flex items-center gap-2 pt-1">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold">
          Comments {comments?.length ? `(${comments.length})` : ''}
        </h2>
      </div>

      <Card className="p-2 sm:p-4">
        {comments && comments.length > 0 ? (
          <div className="divide-y divide-border">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                isAccess={thread && thread.is_access ? 'access' : 'no-access'}
                comment={comment}
                handleSubmitReply={handleSubmitReply}
                updateComments={refresh}
              />
            ))}
          </div>
        ) : (
          <div className="p-2">
            <Alert variant="info">No comments on this thread yet — start the conversation!</Alert>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ThreadDetails;
