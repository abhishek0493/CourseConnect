import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Lightbulb } from 'lucide-react';

import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from '../ui/toaster';

const CreatePostBar = ({ community, isAccess }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAccess !== undefined && isAccess === false) {
      toast.error('You are not a member of this community yet.');
    } else if (community && community.id) {
      navigate(`/dashboard/create-thread?id=${community.id}`, { replace: true });
    } else {
      navigate('/dashboard/create-thread', { replace: true });
    }
  };

  return (
    <Card className="flex items-center gap-3 p-3">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback>
          <PenLine className="h-4 w-4 text-white" />
        </AvatarFallback>
      </Avatar>
      <button
        onClick={handleClick}
        className="h-10 flex-1 rounded-full border border-input bg-muted/50 px-4 text-left text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-card"
      >
        Create a thread…
      </button>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
        <Lightbulb className="h-5 w-5" />
      </span>
    </Card>
  );
};

export default CreatePostBar;
