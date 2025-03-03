import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Select,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  Card,
  Divider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParentContext from '../../ParentContext';

const CreateCommunity = ({ cmCategories, onCreateCommunity }) => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();
  const [nameAvailability, setNameAvailability] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    category: '',
    accessType: 1,
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

  const handleCommunityNameBlur = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/community/check-availability`,
        {
          name: formData.name,
        },
        { withCredentials: true }
      );

      setNameAvailability(response.data.exists);
    } catch (error) {
      // Handle error if API request fails
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios
      .post(`${baseUrl}/api/v1/community`, formData)
      .then((res) => {
        if (res.data.success) {
          const result = res.data.data;
          onCreateCommunity(true);
          navigate(`/dashboard/c/${result.name}`, { replace: true });
        }
      })
      .catch((err) => {
        const response = err.response;
        if (!response.data.success) {
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
        // console.log(err);
      });
  };

  return (
    <>
      <Divider sx={{ width: '100%' }}>
        <Typography variant="h5" sx={{ my: 3, fontWeight: 'bold' }}>
          Create a community
        </Typography>
      </Divider>
      <Card variant="outlined">
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleCreate}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Community Name"
                  fullWidth
                  name="name"
                  type="text"
                  size="small"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  error={
                    nameAvailability ||
                    (validationError && validationMessage.includes('name'))
                  }
                  onBlur={handleCommunityNameBlur}
                  helperText={
                    nameAvailability === true
                      ? 'A Community with this name already exists.'
                      : validationError === true
                      ? validationMessage
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="This will be your community username. Name must be at least 3 and max 20 characters long and can contain letters, numbers, and hyphens. No Spaces are allowed">
                          <IconButton size="small">
                            <InfoIcon sx={{ color: 'warning.main' }} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">Category</InputLabel>
                  <Select
                    label="Category"
                    size="small"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <MenuItem value="0">--- Select ----</MenuItem>
                    {Object.values(cmCategories).map((value) => (
                      <MenuItem key={value.id} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  name="title"
                  size="small"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  error={
                    nameAvailability ||
                    (validationError && validationMessage.includes('title'))
                  }
                  helperText={
                    validationError && validationMessage.includes('title')
                      ? validationMessage
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Write a title for the community. Min 5 & Max 60 characters are allowed">
                          <IconButton size="small">
                            <InfoIcon sx={{ color: 'warning.main' }} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl required>
                  <FormLabel id="accessType">Access Type</FormLabel>
                  <RadioGroup
                    aria-labelledby="accessType"
                    // defaultValue="1"
                    name="accessType"
                    value={formData.accessType}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label={
                        <Typography variant="body2" color="textSecondary">
                          Public (Anyone can view, post and comment on this
                          community)
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label={
                        <Typography variant="body2" color="textSecondary">
                          Restricted (Anyone can view this community, but only
                          approved users can post)
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="3"
                      control={<Radio disabled />}
                      label={
                        <Typography variant="body2" color="textSecondary">
                          Private (Only approved users can view and submit to
                          this community) (*Future Release*)
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  required
                  name="description"
                  multiline
                  rows={6}
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                  error={
                    validationError && validationMessage.includes('description')
                  }
                  helperText={
                    validationError && validationMessage.includes('description')
                      ? validationMessage
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12}>
                {/* Submit button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
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
