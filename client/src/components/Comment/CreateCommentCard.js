import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tooltip,
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
          <Tooltip
            title={isAccess == 'no-access' ? 'Community not joined yet' : ''}
          >
            <TextField
              multiline
              required
              rows={4}
              variant="outlined"
              placeholder="Have something to say?"
              value={comment}
              disabled={isAccess == 'no-access'}
              onChange={handleCommentChange}
              fullWidth
              error={commentError.state}
              helperText={commentError.state ? commentError.message : ''}
            />
          </Tooltip>

          <Button
            variant="contained"
            size="small"
            fullWidth
            disabled={isAccess == 'no-access'}
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
