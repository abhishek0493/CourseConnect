import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Bookmark, GraduationCap } from 'lucide-react';

import ParentContext from '../../ParentContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from '../ui/toaster';
import { VoteRail } from './VoteRail';
import { CourseMeta } from './CourseMeta';
import { cn } from '../../lib/utils';

const timeAgo = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

const ThreadCard = ({
  thread,
  upVoteTrigger,
  downVoteTrigger,
  saveTrigger,
  isDetails,
}) => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();

  const canInteract = !!thread.is_access;
  const noAccess = () => toast.error('You are not a member of this community yet.');

  const vote = async (path, trigger) => {
    if (!canInteract) return noAccess();
    try {
      const res = await axios.get(`${baseUrl}/api/v1/threads/${thread.id}/${path}`, {
        withCredentials: true,
      });
      if (res.data.success) trigger(thread.id, res.data.data.toggle);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed.');
    }
  };

  const handleSave = async () => {
    if (!canInteract) return noAccess();
    try {
      const res = await axios.get(`${baseUrl}/api/v1/threads/${thread.id}/save`, {
        withCredentials: true,
      });
      if (res.data.success) saveTrigger(thread.id, res.data.data.toggle);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <Card interactive={!isDetails} className="flex overflow-hidden">
      <VoteRail
        upvotes={thread.total_upvotes}
        downvotes={thread.total_downvotes}
        isUpvoted={thread.is_upvoted == 1}
        isDownvoted={thread.is_downvoted == 1}
        onUp={() => vote('up-vote-thread', upVoteTrigger)}
        onDown={() => vote('down-vote-thread', downVoteTrigger)}
        disabled={!canInteract}
        disabledReason="Join this community to vote"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 px-4 pt-3 text-xs text-muted-foreground">
          {thread.thread_author && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {thread.thread_author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <span>
            Posted by{' '}
            {thread.is_author == 1 ? (
              <span className="font-semibold text-primary">You</span>
            ) : (
              <span className="font-medium text-foreground">u/{thread.thread_author}</span>
            )}
          </span>
          <span>•</span>
          <span>{timeAgo(thread.created_at)}</span>
          {thread.type == 1 && (
            <Tooltip label="Course thread">
              <span className="ml-auto text-primary"><GraduationCap className="h-4 w-4" /></span>
            </Tooltip>
          )}
        </div>

        <div className="px-4 pt-3">
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight">
            {thread.title}
          </h3>
          {thread.body && (
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {thread.body}
            </p>
          )}
          {thread.type == 1 && <CourseMeta thread={thread} />}
        </div>

        <div className="mt-3 flex items-center gap-1 border-t border-border px-2 py-1.5">
          {!isDetails && (
            <Button variant="ghost" size="sm" className="text-muted-foreground"
              onClick={() => navigate(`/dashboard/c/${thread.name}/${thread.id}/comments`)}>
              <MessageSquare className="h-4 w-4" />
              {thread.total_comments || 0} Comments
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSave}
            className={cn('text-muted-foreground', thread.is_saved && 'text-success')}>
            <Bookmark className={cn('h-4 w-4', thread.is_saved && 'fill-success')} />
            {thread.is_saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ThreadCard;
