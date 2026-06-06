import React from 'react';
import { BadgeCheck, ShieldAlert, Star, Tag, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge';

/**
 * The course-specific meta chips shown for course-type threads.
 */
export function CourseMeta({ thread }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {thread.is_course_completed ? (
        <Badge variant="success"><BadgeCheck /> Completed this course</Badge>
      ) : (
        <Badge variant="muted"><ShieldAlert /> Not completed yet</Badge>
      )}
      <Badge variant="secondary"><Star /> {thread.author_rating}/5</Badge>
      <Badge variant={Number(thread.pricing) === 1 ? 'success' : 'warning'}>
        <Tag /> {Number(thread.pricing) === 1 ? 'Free' : 'Paid'}
      </Badge>
      {thread.link && (
        <a
          href={/^https?:\/\//.test(thread.link) ? thread.link : `https://${thread.link}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge variant="outline" className="max-w-[16rem] hover:border-primary/50 hover:text-primary">
            <ExternalLink />
            <span className="truncate">{thread.link}</span>
          </Badge>
        </a>
      )}
    </div>
  );
}
