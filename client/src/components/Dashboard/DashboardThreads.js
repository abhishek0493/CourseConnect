import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageSquare,
  Bookmark,
  Ban,
  Star,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

import { FormatCount } from '../Constants/RefactorCount';
import { getAccessIcon } from '../Constants/GetAccessIcon';
import ParentContext from '../../ParentContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { toast } from '../ui/toaster';
import { VoteRail } from '../Thread/VoteRail';
import { CourseMeta } from '../Thread/CourseMeta';
import { cn } from '../../lib/utils';

const timeAgo = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

const DashboardThreads = ({
  thread,
  upVoteTrigger,
  downVoteTrigger,
  saveTrigger,
  isCommunityJoined,
}) => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { is_joined, is_request_pending } = thread;
  const label =
    is_joined === 1 ? 'Joined' : is_request_pending === 1 ? 'Pending' : 'Join';
  const canInteract = thread.is_joined === 1 || thread.is_author === 1;
  const access = getAccessIcon(thread.access_type);
  const AccessIcon = access.Icon;
  const CategoryIcon = thread.Icon;

  const handleJoin = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/community/${id}/join`);
      if (res.data.success) {
        toast.success(res.data.data.message);
        setOpen(false);
        isCommunityJoined(true);
        navigate(`/dashboard/c/${res.data.data.name}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not join community.');
    }
  };

  const vote = async (path, trigger) => {
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
    <Card interactive className="flex overflow-hidden">
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
        {/* Meta header */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-3 text-xs text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient text-white">
            {CategoryIcon ? <CategoryIcon className="h-3.5 w-3.5" /> : null}
          </span>
          <button
            onClick={() => navigate(`/dashboard/c/${thread.community_name}`)}
            className="font-semibold text-foreground hover:text-primary hover:underline"
          >
            c/{thread.community_name}
          </button>
          <span>•</span>
          <span>Posted by {thread.author}</span>
          <span>•</span>
          <span>{timeAgo(thread.created_at)}</span>

          <div className="ml-auto flex items-center gap-1.5">
            <Tooltip label={thread.type == 1 ? 'Course thread' : 'Discussion thread'}>
              <span className="text-muted-foreground">
                {thread.type == 1 ? <GraduationCap className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
              </span>
            </Tooltip>
            <Tooltip label={access.message}>
              <Badge variant={access.tone}><AccessIcon /> {access.type}</Badge>
            </Tooltip>
            {thread.is_creator != 1 ? (
              <Button size="sm" variant={label === 'Joined' ? 'secondary' : 'outline'} onClick={() => setOpen(true)} className="h-7">
                {label}
              </Button>
            ) : (
              <Tooltip label="You manage this community">
                <span className="flex items-center gap-1 text-primary"><ShieldCheck className="h-4 w-4" /></span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Title + body */}
        <button
          onClick={() => navigate(`/dashboard/c/${thread.name}/${thread.id}/comments`)}
          className="block w-full px-4 pt-3 text-left"
        >
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight hover:text-primary">
            {thread.title}
          </h3>
        </button>
        {thread.body && (
          <p className="px-4 pt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {thread.body}
          </p>
        )}
        {thread.type == 1 && <div className="px-4">{<CourseMeta thread={thread} />}</div>}

        {/* Footer actions */}
        <div className="mt-3 flex items-center gap-1 border-t border-border px-2 py-1.5">
          <Button variant="ghost" size="sm" className="text-muted-foreground"
            onClick={() => navigate(`/dashboard/c/${thread.name}/${thread.id}/comments`)}>
            <MessageSquare className="h-4 w-4" />
            {FormatCount(thread.total_comments || 0)} Comments
          </Button>
          {canInteract ? (
            <Button variant="ghost" size="sm" onClick={handleSave}
              className={cn('text-muted-foreground', thread.is_saved && 'text-success')}>
              <Bookmark className={cn('h-4 w-4', thread.is_saved && 'fill-success')} />
              {thread.is_saved ? 'Saved' : 'Save'}
            </Button>
          ) : (
            <Tooltip label="Join this community to save">
              <span className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-muted-foreground/60">
                <Ban className="h-4 w-4" /> Save
              </span>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Join dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>c/{thread.community_name}</DialogTitle>
            <DialogDescription>{access.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="gradient" onClick={() => handleJoin(thread.community_id)}>
              {label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DashboardThreads;
