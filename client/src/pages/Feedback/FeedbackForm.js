import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const FeedbackForm = () => {
  const classes = useStyles();
  const [answers, setAnswers] = useState({
    lookAndFeel: '',
    easeOfUse: '',
    functionality: '',
    likedFeature: '',
    considerUsing: '',
    improvements: '',
  });

  const handleAnswerChange = (question, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer,
    }));
  };

  const handleSubmit = () => {
    // Submit answers to the backend or perform any desired action
    console.log(answers);
  };

  return (
    <Container>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" textAlign={'center'} mb={4}>
          User Feedback Form
        </Typography>
        <form>
          {/* Overall Look & Feel */}
          <FormControl component="fieldset" fullWidth>
            <Typography variant="body1" fontWeight={'bold'}>
              Overall Look & Feel
            </Typography>
            <Typography variant="subtitle1">
              1. How would you describe the visual appeal of the application?
            </Typography>
            <RadioGroup
              row
              aria-label="look-and-feel"
              name="look-and-feel"
              value={answers.lookAndFeel}
              onChange={(e) =>
                handleAnswerChange('lookAndFeel', e.target.value)
              }
            >
              <FormControlLabel
                value="excellent"
                control={<Radio size="small" />}
                label="Excellent"
              />
              <FormControlLabel value="good" control={<Radio />} label="Good" />
              <FormControlLabel
                value="average"
                control={<Radio size="small" />}
                label="Average"
              />
              <FormControlLabel
                value="below-average"
                control={<Radio size="small" />}
                label="Below Average"
              />
              <FormControlLabel
                value="poor"
                control={<Radio size="small" />}
                label="Poor"
              />
            </RadioGroup>
          </FormControl>

          {/* Other questions follow the same pattern */}

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            Submit Feedback
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;
