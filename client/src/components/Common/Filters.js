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
import { useNavigate } from 'react-router-dom';

const Filters = ({ handleReset }) => {
  const navigate = useNavigate();
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
