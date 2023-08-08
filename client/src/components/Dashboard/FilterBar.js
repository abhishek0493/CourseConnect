import React from 'react';

import { Box, Typography, TextField, MenuItem } from '@mui/material';

import CategoryIcon from '@mui/icons-material/Category';
import { Categories } from '../Constants/Categories';
import Filters from '../Common/Filters';

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
    <>
      <Box sx={{ my: 2, p: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              # {title}
            </Typography>
          </Box>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            size="small"
            value={filterState.isCategory}
            label={
              <Typography variant="body2">
                <CategoryIcon sx={{ mx: 1 }} />
                Filter By Category
              </Typography>
            }
            sx={{ maxWidth: '280px' }}
            onChange={(event) => handleFilterByCategory(event.target.value)}
          >
            {Categories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Typography variant="body2">{option.label}</Typography>
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Filters
          handleReset={handleReset}
          filterState={filterState}
          toggleCourse={(val) => handleCourseToggle(val)}
          togglePosted={(val) => handlePostedToggle(val)}
          toggleSaved={(val) => handleSavedToggle(val)}
        />
      </Box>
    </>
  );
};

export default FilterBar;
