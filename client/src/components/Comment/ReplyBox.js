import React, { useState } from 'react';
import { Box, TextField, Button, Avatar } from '@mui/material';

const ReplyBox = ({ commentId, onSubmit }) => {
  const [reply, setReply] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(reply);
    setReply('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
      <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}></Avatar>
      <Box sx={{ flexGrow: 1, ml: '0.5rem' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            multiline
            fullWidth
            rows={4}
            label="Post a reply.."
            variant="outlined"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 1 }} type="submit" size="small">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ReplyBox;
