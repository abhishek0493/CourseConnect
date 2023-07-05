import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Card,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });
  const [validationError, setValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const location = useLocation();
  const state = location.state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError(false);
    setValidationMessage('');
  };

  const handleCreate = () => {};

  return (
    <>
      <Card variant="outlined">
        <Box sx={{ p: 6 }}>
          <Typography variant="h4" sx={{ my: 3 }}>
            Create a community
          </Typography>
          <form onSubmit={handleCreate}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Community Name"
                  fullWidth
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    onChange={handleChange}
                    error={
                      validationError && validationMessage.includes('category')
                    }
                    helperText={
                      validationError && validationMessage.includes('category')
                        ? validationMessage
                        : ''
                    }
                  >
                    <MenuItem value="0">--- Select ----</MenuItem>
                    <MenuItem value="0">Science & Technology</MenuItem>
                    <MenuItem value="0">Creative Arts</MenuItem>
                    <MenuItem value="0">Business & Entrepreneurship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  name="description"
                  multiline
                  rows={6}
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Submit button */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Card>
    </>
  );
};

export default CreateCommunity;
