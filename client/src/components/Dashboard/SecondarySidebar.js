import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  MessageSquare,
  CornerDownRight,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Bell,
  FilePlus2,
  UserPlus,
} from 'lucide-react';

import { Refactor } from '../Constants/Refactor';
import ParentContext from '../../ParentContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

const StatTile = ({ icon: Icon, label, value, tone = 'default' }) => (
  <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/40 p-3">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon
        className={cn(
          'h-3.5 w-3.5',
          tone === 'up' && 'text-success',
          tone === 'down' && 'text-accent'
        )}
      />
      <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
    </div>
    <span className="font-display text-xl font-bold tabular-nums">{value ?? 0}</span>
  </div>
);

const SecondarySidebar = () => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    axios
      .get(`${baseUrl}/api/v1/users/get-stats`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && active) {
          const result = Refactor(res.data);
          setUser(result[0]);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [baseUrl]);

  if (!user) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const initial = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <Card className="overflow-hidden">
      {/* Banner + identity */}
      <div className="h-16 bg-brand-gradient" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end gap-3">
          <Avatar className="h-16 w-16 border-4 border-card shadow-soft">
            <AvatarFallback className="text-lg">{initial}</AvatarFallback>
          </Avatar>
          <div className="pb-1">
            <p className="font-display text-base font-bold leading-tight">{user.name}</p>
            <p className="text-xs text-muted-foreground">u/{user.name}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <StatTile icon={Users} label="Created" value={user.total_communities_created} />
          <StatTile icon={UserPlus} label="Joined" value={user.total_communities_joined} />
          <StatTile icon={FilePlus2} label="Threads" value={user.total_threads_created} />
          <StatTile icon={MessageSquare} label="Comments" value={user.total_comments} />
          <StatTile icon={CornerDownRight} label="Replies" value={user.total_replies} />
          <StatTile icon={Bookmark} label="Saved" value={user.total_saved} />
          <StatTile icon={ArrowUp} label="Upvotes" value={user.total_upvotes} tone="up" />
          <StatTile icon={ArrowDown} label="Downvotes" value={user.total_downvotes} tone="down" />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate('/dashboard/view-all-requests', { replace: true })}
          >
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Join Requests
            </span>
            {user.total_requests > 0 && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
                {user.total_requests}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate('/dashboard/view-all-saved', { replace: true })}
          >
            <span className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" /> Saved Threads
            </span>
            {user.total_saved > 0 && (
              <span className="rounded-full bg-success px-2 py-0.5 text-xs font-semibold text-success-foreground">
                {user.total_saved}
              </span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SecondarySidebar;
