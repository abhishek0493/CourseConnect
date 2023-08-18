import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const CreateCommentCard = ({ onSubmit, commentError, onChange, isAccess }) => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
    onChange(false);
  };

  return (
    <Card variant="outlined">
      <form onSubmit={handleSubmit}>
        <CardContent>
          <TextField
            multiline
            required
            rows={4}
            variant="outlined"
            placeholder="Have something to say?"
            value={comment}
            onChange={handleCommentChange}
            fullWidth
            error={commentError.state}
            helperText={commentError.state ? commentError.message : ''}
          />
          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
            color="primary"
            onClick={handleSubmit}
          >
            Comment
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default CreateCommentCard;
