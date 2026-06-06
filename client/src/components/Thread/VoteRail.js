import React from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { FormatCount } from '../Constants/RefactorCount';
import { Tooltip } from '../ui/tooltip';
import { cn } from '../../lib/utils';

/**
 * Vertical up/down vote rail used on thread cards.
 */
export function VoteRail({
  upvotes = 0,
  downvotes = 0,
  isUpvoted,
  isDownvoted,
  onUp,
  onDown,
  disabled,
  disabledReason,
}) {
  const score = (Number(upvotes) || 0) - (Number(downvotes) || 0);

  const btn = (active, activeClass) =>
    cn(
      'flex h-7 w-7 items-center justify-center rounded-md transition-all active:scale-90 disabled:opacity-40',
      active ? activeClass : 'text-muted-foreground hover:bg-background hover:text-foreground',
      disabled && 'cursor-not-allowed'
    );

  const Up = (
    <button type="button" onClick={onUp} disabled={disabled} className={btn(isUpvoted, 'bg-success/15 text-success')} aria-label="Upvote">
      <ArrowBigUp className={cn('h-5 w-5', isUpvoted && 'fill-success')} />
    </button>
  );
  const Down = (
    <button type="button" onClick={onDown} disabled={disabled} className={btn(isDownvoted, 'bg-accent/15 text-accent')} aria-label="Downvote">
      <ArrowBigDown className={cn('h-5 w-5', isDownvoted && 'fill-accent')} />
    </button>
  );

  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-0.5 rounded-l-xl bg-muted/50 py-3">
      {disabled && disabledReason ? <Tooltip label={disabledReason}><span>{Up}</span></Tooltip> : Up}
      <span className={cn(
        'text-sm font-bold tabular-nums',
        isUpvoted ? 'text-success' : isDownvoted ? 'text-accent' : 'text-foreground'
      )}>
        {FormatCount(score)}
      </span>
      {disabled && disabledReason ? <Tooltip label={disabledReason}><span>{Down}</span></Tooltip> : Down}
    </div>
  );
}
