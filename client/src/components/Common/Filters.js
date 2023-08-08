import React from 'react';

import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Typography,
} from '@mui/material';

import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';

const Filters = ({
  handleReset,
  filterState,
  toggleSaved,
  toggleCourse,
  togglePosted,
}) => {
  return (
    <Box
      sx={{ mt: 1, display: 'flex', p: 1.2, justifyContent: 'space-between' }}
    >
      <Box sx={{ display: 'flex' }}>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  icon={<BookmarkAddedOutlinedIcon />}
                  checkedIcon={<BookmarkAddedIcon />}
                  color="warning"
                  checked={filterState.isSaved}
                  onChange={() => toggleSaved(filterState.isSaved ? 0 : 1)}
                />
              }
              label="Saved Threads"
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  icon={<StarsOutlinedIcon />}
                  checkedIcon={<StarsRoundedIcon />}
                  color="warning"
                  checked={filterState.isCourse}
                  onChange={() => toggleCourse(filterState.isCourse ? 0 : 1)}
                />
              }
              label="Course Threads"
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  icon={<AccountCircleOutlinedIcon />}
                  checkedIcon={<AccountCircleRoundedIcon />}
                  color="warning"
                  checked={filterState.isAuthorPosted}
                  onChange={() =>
                    togglePosted(filterState.isAuthorPosted ? 0 : 1)
                  }
                />
              }
              label="Posted by me"
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
      </Box>
      <IconButton sx={{ borderRadius: 2 }} onClick={handleReset}>
        <RestartAltOutlinedIcon />
        <Typography variant="body1" sx={{ mx: 1, color: '#333333' }}>
          Reset Filters
        </Typography>
      </IconButton>
    </Box>
  );
};

export default Filters;
