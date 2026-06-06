import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * 5-star rating input with half-step support on click position.
 */
export function Rating({ value = 0, onChange, readOnly, size = 'h-6 w-6' }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? value;

  const handleClick = (e, star) => {
    if (readOnly || !onChange) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    onChange(isHalf ? star - 0.5 : star);
  };

  return (
    <div className={cn('inline-flex items-center gap-0.5', readOnly && 'pointer-events-none')}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(display - (star - 1), 0), 1);
        return (
          <button
            key={star}
            type="button"
            onMouseMove={(e) => {
              if (readOnly) return;
              const { left, width } = e.currentTarget.getBoundingClientRect();
              setHover(e.clientX - left < width / 2 ? star - 0.5 : star);
            }}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => handleClick(e, star)}
            className="relative"
            aria-label={`${star} star`}
          >
            <Star className={cn(size, 'text-muted-foreground/40')} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn(size, 'fill-warning text-warning')} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
