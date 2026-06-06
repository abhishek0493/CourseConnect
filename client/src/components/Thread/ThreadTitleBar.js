import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Info, Bell } from 'lucide-react';

import { getAccessIcon } from '../Constants/GetAccessIcon';
import ParentContext from '../../ParentContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip } from '../ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { toast } from '../ui/toaster';

const ThreadTitleBar = ({ community, isCommunityJoined }) => {
  const [open, setOpen] = useState(false);
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();

  const access = getAccessIcon(community.access_type);
  const AccessIcon = access.Icon;
  const CategoryIcon = community.Icon;

  const action = (() => {
    if (community.is_author) return { label: 'Created', variant: 'secondary', clickable: false };
    if (!community.allow_access) return { label: 'Request Pending', variant: 'outline', clickable: false };
    if (!community.is_joined) return { label: 'Join', variant: 'gradient', clickable: true };
    return { label: 'Joined', variant: 'secondary', clickable: false };
  })();

  const handleJoin = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/community/${community.id}/join`);
      if (res.data.success) {
        toast.success(res.data.data.message);
        isCommunityJoined(true);
        navigate(`/dashboard/c/${res.data.data.name}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not join community.');
    }
  };

  const canViewRequests =
    community && community.is_author == 1 &&
    (community.access_type == 2 || community.access_type == 3);

  return (
    <Card className="overflow-hidden">
      <div className="h-20 bg-brand-gradient" />
      <div className="px-5 pb-5">
        <div className="-mt-9 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-end gap-3">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-brand-gradient text-white shadow-soft">
              {CategoryIcon ? <CategoryIcon className="h-7 w-7" /> : null}
            </span>
            <div className="pb-1">
              <h1 className="font-display text-xl font-bold leading-tight sm:text-2xl">
                {community.title}
              </h1>
              <p className="text-sm text-muted-foreground">c/{community.name}</p>
            </div>
          </div>

          {action.clickable ? (
            <Button variant={action.variant} onClick={handleJoin}>{action.label}</Button>
          ) : (
            <Badge variant="muted" className="px-3 py-1.5 text-sm">{action.label}</Badge>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tooltip label={access.message}>
            <Badge variant={access.tone}><AccessIcon /> {access.type} community</Badge>
          </Tooltip>
          <Tooltip label="Total members">
            <Badge variant="secondary"><Users /> {community.total_joined_users} members</Badge>
          </Tooltip>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-muted-foreground">
            <Info className="h-4 w-4" /> Learn more
          </Button>
          {canViewRequests && (
            <Button variant="outline" size="sm" className="ml-auto"
              onClick={() => navigate(`/dashboard/${community.name}/view-requests`)}>
              <Bell className="h-4 w-4" /> Join requests
            </Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About c/{community.name}</DialogTitle>
            <DialogDescription className="text-foreground/80">
              {community.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ThreadTitleBar;
