import React from 'react';
import { Flame, SlidersHorizontal } from 'lucide-react';

import { Categories } from '../Constants/Categories';
import Filters from '../Common/Filters';
import { SectionHeading } from '../Common/SectionHeading';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';

const FilterBar = ({
  title,
  filterState,
  handleFilterByCategory,
  handleCourseToggle,
  handlePostedToggle,
  handleSavedToggle,
  handleReset,
}) => {
  return (
    <div className="space-y-4">
      <SectionHeading
        icon={Flame}
        action={
          <div className="w-[210px]">
            <Select
              value={filterState.isCategory ? String(filterState.isCategory) : '0'}
              onValueChange={(v) => handleFilterByCategory(Number(v))}
            >
              <SelectTrigger className="h-9">
                <span className="flex items-center gap-2 truncate">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All categories</SelectItem>
                {Categories.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {title}
      </SectionHeading>

      <Filters
        handleReset={handleReset}
        filterState={filterState}
        toggleCourse={(val) => handleCourseToggle(val)}
        togglePosted={(val) => handlePostedToggle(val)}
        toggleSaved={(val) => handleSavedToggle(val)}
      />
    </div>
  );
};

export default FilterBar;
