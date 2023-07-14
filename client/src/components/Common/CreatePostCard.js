import {
  Grid,
  FormControl,
  Select,
  TextField,
  InputLabel,
  MenuItem,
  Button,
  Card,
  FormGroup,
  FormControlLabel,
  Rating,
  Box,
  ListSubheader,
  Typography,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostCard = ({ communities, selectedId }) => {
  // const [selectedOption, setSelectedOption] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    community: selectedId ? selectedId : '',
    type: 1,
    title: '',
    source: '',
    pricing: 0,
    link: '',
    body: '',
    is_completed: false,
    rating: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios
      .post('http://localhost:8000/api/v1/threads', formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((err) => {
        const response = err.response;
        if (!response.data.success) {
          // setValidationError(true);
          // setValidationMessage(response.data.message);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleCreate}>
        <Box sx={{ mt: 2 }}>
          <Grid container>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel>Select a community</InputLabel>
                <Select
                  label="Select a community"
                  variant="outlined"
                  value={Number(formData.community)}
                  name="community"
                  onChange={handleChange}
                >
                  <ListSubheader>Created communities</ListSubheader>
                  {Object.values(communities).map((value) => {
                    if (value.is_author) {
                      return (
                        <MenuItem
                          key={value.community_id}
                          value={value.community_id}
                        >
                          {value.name}
                        </MenuItem>
                      );
                    }
                  })}
                  <ListSubheader>Joined communities</ListSubheader>
                  {Object.values(communities).map((value) => {
                    if (!value.is_author && value.is_approved) {
                      return (
                        <MenuItem
                          key={value.community_id}
                          value={value.community_id}
                        >
                          {value.name}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1} alignItems="center">
              <Typography variant="h6" fontWeight="bold" mx="1rem">
                OR
              </Typography>
            </Grid>
            <Grid item xs={3} alignItems="center">
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  navigate('/dashboard/create-community', { replace: true });
                }}
              >
                Create Community
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ my: 1, p: 2 }}>
          <Grid container>
            <Grid item xs={4} sx={{ p: 1 }}>
              <Typography variant="h7" fontWeight="bold">
                This thread is about
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel size="small">Type</InputLabel>
                <Select
                  label="Type"
                  variant="outlined"
                  name="type"
                  size="small"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <MenuItem key={1} value={1}>
                    A course which I want to share
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    Ask a question / Post an update
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box>
          {formData.type == 1 && (
            <>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      fullWidth
                      size="small"
                      name="title"
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange(e)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Platform on which the course is available"
                      name="source"
                      size="small"
                      fullWidth
                      required
                      value={formData.source}
                      helperText={
                        <Typography variant="caption">
                          For e.g Youtube,Udemy,Skillshare etc
                        </Typography>
                      }
                      onChange={handleChange}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel size="small">Pricing</InputLabel>
                      <Select
                        label="Pricing"
                        variant="outlined"
                        name="pricing"
                        size="small"
                        value={formData.pricing}
                        required
                        onChange={handleChange}
                      >
                        <MenuItem key="0" value="0">
                          --- Select ---
                        </MenuItem>
                        <MenuItem key="1" value="1">
                          Free
                        </MenuItem>
                        <MenuItem key="2" value="2">
                          Paid
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Link to the course"
                      fullWidth
                      size="small"
                      name="link"
                      type="text"
                      value={formData.link}
                      required
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Text (Optional)"
                      fullWidth
                      name="body"
                      value={formData.body}
                      multiline
                      rows={6}
                      type="text"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.is_completed}
                            onChange={handleChange}
                            name="is_completed"
                          />
                        }
                        label="I have completed this course"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">
                      Rate the course based on your experience
                    </Typography>
                    <Rating
                      name="rating"
                      value={Number(formData.rating)}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} m={2}>
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
              </Card>
            </>
          )}
          {formData.type == 2 && (
            <>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      fullWidth
                      size="small"
                      name="title"
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Write something"
                      fullWidth
                      multiline
                      rows={6}
                      size="small"
                      name="body"
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} m={2}>
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
              </Card>
            </>
          )}
        </Box>
      </form>
    </>
  );
};

export default CreatePostCard;
