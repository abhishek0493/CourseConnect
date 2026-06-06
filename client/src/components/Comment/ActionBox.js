import React, { useContext } from 'react';
import axios from 'axios';
import { ArrowBigUp, ArrowBigDown, Reply } from 'lucide-react';

import ParentContext from '../../ParentContext';
import { toast } from '../ui/toaster';
import { cn } from '../../lib/utils';

const ActionBox = ({
  commentId,
  handleReplyButtonClick,
  comment,
  upVoteTrigger,
  downVoteTrigger,
  isAccess,
}) => {
  const { baseUrl } = useContext(ParentContext);
  const noAccess = isAccess === 'no-access';

  const vote = async (dir, trigger) => {
    if (noAccess) {
      toast.error('You are not a member of this community yet.');
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/api/v1/comments/${commentId}/${dir}`, {
        withCredentials: true,
      });
      if (res.data.success) trigger(commentId);
    } catch {
      /* silent */
    }
  };

  const pill =
    'inline-flex items-center gap-1 rounded-full bg-muted/60 px-1 py-0.5 text-xs font-semibold text-muted-foreground';
  const iconBtn =
    'flex h-6 w-6 items-center justify-center rounded-full transition-colors active:scale-90';

  return (
    <div className="flex items-center gap-2">
      <div className={pill}>
        <button onClick={() => vote('up-vote', upVoteTrigger)} className={cn(iconBtn, 'hover:bg-success/15 hover:text-success')} aria-label="Upvote">
          <ArrowBigUp className="h-4 w-4" />
        </button>
        <span className="min-w-3 text-center tabular-nums">
          {(Number(comment?.total_upvotes) || 0) - (Number(comment?.total_downvotes) || 0)}
        </span>
        <button onClick={() => vote('down-vote', downVoteTrigger)} className={cn(iconBtn, 'hover:bg-accent/15 hover:text-accent')} aria-label="Downvote">
          <ArrowBigDown className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => handleReplyButtonClick(commentId)}
        disabled={noAccess}
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <Reply className="h-3.5 w-3.5" /> Reply
      </button>
    </div>
  );
};

export default ActionBox;
