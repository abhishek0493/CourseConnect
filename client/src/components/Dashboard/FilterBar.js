import {
  Box,
  IconButton,
  Typography,
  Card,
  TextField,
  MenuItem,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CategoryIcon from '@mui/icons-material/Category';
import React from 'react';
import { Categories } from '../Constants/Categories';

const FilterBar = () => {
  return (
    <>
      <Card sx={{ my: 2, p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <IconButton sx={{ borderRadius: 2 }}>
              <WhatshotIcon sx={{ fontSize: '1.2rem' }} />
              <Typography sx={{ mx: 1, color: '#333333' }} variant="body2">
                Trending
              </Typography>
            </IconButton>
            <IconButton sx={{ borderRadius: 2 }}>
              <WhatshotIcon sx={{ fontSize: '1.2rem' }} />
              <Typography sx={{ mx: 1, color: '#333333' }} variant="body2">
                Trending
              </Typography>
            </IconButton>
            <IconButton sx={{ borderRadius: 2 }}>
              <WhatshotIcon sx={{ fontSize: '1.2rem' }} />
              <Typography sx={{ mx: 1, color: '#333333' }} variant="body2">
                Trending
              </Typography>
            </IconButton>
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
      </Card>
    </>
  );
};

export default FilterBar;
