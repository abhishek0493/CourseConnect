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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GeneralForm = () => {
  return (
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
            name="title"
            type="text"
          />
        </Grid>
        <Grid item xs={12} m={2}>
          {/* Submit button */}
          <Button variant="contained" color="primary" fullWidth type="submit">
            Create
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

const CourseForm = () => {
  const [rating, setRating] = useState(0);

  return (
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
        <Grid item xs={6}>
          <TextField
            label="Platform on which the course is available"
            name="source"
            size="small"
            fullWidth
            helperText={
              <Typography variant="caption">
                For e.g Youtube,Udemy,Skillshare etc
              </Typography>
            }
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
            >
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Text (Optional)"
            fullWidth
            name="body"
            multiline
            rows={6}
            type="text"
          />
        </Grid>
        <Grid item xs={6}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="I have completed this course"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">
            Rate the course based on your experience
          </Typography>
          <Rating
            name="Rating (optional)"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Grid>
        <Grid item xs={12} m={2}>
          {/* Submit button */}
          <Button variant="contained" color="primary" fullWidth type="submit">
            Create
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

const CreatePostCard = ({ communities }) => {
  const [selectedOption, setSelectedOption] = useState(1);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <form>
        <Box sx={{ mt: 2 }}>
          <Grid container>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel>Select a community</InputLabel>
                <Select
                  label="Select a community"
                  variant="outlined"
                  name="community"
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
                  name="category"
                  size="small"
                  value={selectedOption}
                  onChange={handleChange}
                >
                  <MenuItem value="1">A course which I want to share</MenuItem>
                  <MenuItem value="2">Ask a question / Post an update</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box>
          {selectedOption == 1 && <CourseForm />}
          {selectedOption == 2 && <GeneralForm />}
        </Box>
      </form>
    </>
  );
};

export default CreatePostCard;
