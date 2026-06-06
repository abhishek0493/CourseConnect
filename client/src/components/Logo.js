import React from 'react';
import { cn } from '../lib/utils';

/**
 * CourseConnect brand mark — two linked nodes forming a "connect" glyph,
 * paired with a gradient wordmark. Pure SVG so it stays crisp in any theme.
 */
export function LogoMark({ className }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-soft',
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M9.5 9.5 14.5 14.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Logo({ className, showText = true, textClassName }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {showText && (
        <span
          className={cn(
            'font-display text-lg font-extrabold tracking-tight',
            textClassName
          )}
        >
          Course<span className="text-gradient">Connect</span>
        </span>
      )}
    </span>
  );
}
