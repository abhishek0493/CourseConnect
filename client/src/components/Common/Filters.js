import React from 'react';
import { Bookmark, GraduationCap, UserCircle2, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

const FilterChip = ({ active, icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95',
      active
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

const Filters = ({ handleReset, filterState, toggleSaved, toggleCourse, togglePosted }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip active={!!filterState.isSaved} icon={Bookmark} label="Saved"
        onClick={() => toggleSaved(filterState.isSaved ? 0 : 1)} />
      <FilterChip active={!!filterState.isCourse} icon={GraduationCap} label="Courses"
        onClick={() => toggleCourse(filterState.isCourse ? 0 : 1)} />
      <FilterChip active={!!filterState.isAuthorPosted} icon={UserCircle2} label="Posted by me"
        onClick={() => togglePosted(filterState.isAuthorPosted ? 0 : 1)} />
      <button
        type="button"
        onClick={handleReset}
        className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
    </div>
  );
};

export default Filters;
