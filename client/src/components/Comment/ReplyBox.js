import React, { useState } from 'react';
import { Send } from 'lucide-react';

import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const ReplyBox = ({ commentId, onSubmit }) => {
  const [reply, setReply] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onSubmit(reply, commentId);
    setReply('');
  };

  return (
    <form onSubmit={handleSubmit} className="my-3 space-y-2 border-l-2 border-primary/30 pl-3">
      <Textarea
        rows={3}
        placeholder="Post a reply…"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={!reply.trim()}>
        <Send className="h-3.5 w-3.5" /> Submit
      </Button>
    </form>
  );
};

export default ReplyBox;
