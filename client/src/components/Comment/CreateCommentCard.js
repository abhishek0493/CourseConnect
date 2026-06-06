import React, { useState } from 'react';
import { Send } from 'lucide-react';

import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';

const CreateCommentCard = ({ onSubmit, commentError, onChange, isAccess }) => {
  const [comment, setComment] = useState('');
  const noAccess = isAccess === 'no-access';

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment('');
    onChange(false);
  };

  const field = (
    <Textarea
      rows={3}
      placeholder={noAccess ? 'Join this community to comment' : 'Have something to say?'}
      value={comment}
      disabled={noAccess}
      onChange={(e) => setComment(e.target.value)}
      error={commentError.state}
    />
  );

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {noAccess ? <Tooltip label="Community not joined yet"><div>{field}</div></Tooltip> : field}
        {commentError.state && (
          <p className="text-sm font-medium text-destructive">{commentError.message}</p>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={noAccess || !comment.trim()}>
            <Send className="h-4 w-4" /> Comment
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateCommentCard;
