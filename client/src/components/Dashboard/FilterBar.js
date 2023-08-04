import React from 'react';

import { Box, Typography, TextField, MenuItem } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { Categories } from '../Constants/Categories';

const FilterBar = () => {
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
              # Trending Threads
            </Typography>
          </Box>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            size="small"
            label={
              <Typography variant="body2">
                <CategoryIcon sx={{ mx: 1 }} />
                Filter By Category
              </Typography>
            }
            sx={{ maxWidth: '250px' }}
          >
            {Categories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Typography variant="body2">{option.label}</Typography>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export default FilterBar;
