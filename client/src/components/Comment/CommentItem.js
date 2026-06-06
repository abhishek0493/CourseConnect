import React, { useState } from 'react';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import ReplyBox from './ReplyBox';
import ActionBox from './ActionBox';

const CommentBody = ({ author, comment }) => (
  <>
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-[10px]">
          {author ? author.charAt(0).toUpperCase() : '?'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold text-foreground">{author}</span>
    </div>
    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
      {comment}
    </p>
  </>
);

const CommentItem = ({ comment, handleSubmitReply, updateComments, isAccess }) => {
  const [showNestedComments, setShowNestedComments] = useState(false);
  const [showReplyBoxId, setShowReplyBoxId] = useState(null);

  const handleReplyButtonClick = (commentId) =>
    setShowReplyBoxId((prev) => (prev === commentId ? null : commentId));

  const handleCommentUpdate = () => updateComments(true);

  const renderNestedComments = (comments, depth) => {
    if (!showNestedComments && depth >= 3) return null;

    return comments.map((el) => (
      <div key={el.id} className="mt-3 border-l-2 border-border pl-3 sm:pl-4">
        <CommentBody author={el.author} comment={el.comment} />
        <div className="mt-2">
          <ActionBox
            isAccess={isAccess}
            commentId={el.id}
            comment={el}
            handleReplyButtonClick={handleReplyButtonClick}
            upVoteTrigger={handleCommentUpdate}
            downVoteTrigger={handleCommentUpdate}
          />
        </div>
        {el.id === showReplyBoxId && <ReplyBox commentId={el.id} onSubmit={handleSubmitReply} />}
        {el.comments.length > 0 && (
          <>
            {renderNestedComments(el.comments, depth + 1)}
            {depth === 2 && (
              <Button variant="link" size="sm" className="mt-1 h-auto p-0"
                onClick={() => setShowNestedComments((s) => !s)}>
                {showNestedComments ? 'Hide replies' : 'Show more replies'}
              </Button>
            )}
          </>
        )}
      </div>
    ));
  };

  return (
    <div className="py-4">
      <CommentBody author={comment.author} comment={comment.comment} />
      <div className="mt-2">
        <ActionBox
          isAccess={isAccess}
          commentId={comment.id}
          comment={comment}
          handleReplyButtonClick={handleReplyButtonClick}
          upVoteTrigger={handleCommentUpdate}
          downVoteTrigger={handleCommentUpdate}
        />
      </div>
      {renderNestedComments(comment.comments, 1)}
      {comment.id === showReplyBoxId && <ReplyBox commentId={comment.id} onSubmit={handleSubmitReply} />}
    </div>
  );
};

export default CommentItem;
