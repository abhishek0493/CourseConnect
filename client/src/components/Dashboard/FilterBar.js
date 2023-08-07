import React from 'react';

import { Box, Typography, TextField, MenuItem } from '@mui/material';

import CategoryIcon from '@mui/icons-material/Category';
import { Categories } from '../Constants/Categories';
import Filters from '../Common/Filters';

import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const FilterBar = ({
  title,
  handleGetSave,
  handleGetTrending,
  handleFilterByCategory,
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
          {/* {title == 'Trending Threads' && (
            <>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => handleGetSave({ is_saved: 1 })}
              >
                <BookmarkAddedIcon sx={{ mx: 0.5 }} />
                Saved
              </Button>
            </>
          )}
          {title == 'Saved Threads' && (
            <>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleGetTrending}
              >
                <WhatshotIcon sx={{ mx: 0.5 }} />
                Trending
              </Button>
            </>
          )} */}
        </Box>
        <Filters handleReset={handleReset} />
      </Box>
    </>
  );
};

export default FilterBar;
