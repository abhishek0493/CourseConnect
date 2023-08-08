import React, { useState } from 'react';
import {
  Typography,
  Card,
  Grid,
  Divider,
  Avatar,
  Button,
  Modal,
  Box,
  Tooltip,
  IconButton,
  Badge,
} from '@mui/material';

import { getAccessIcon } from '../Constants/GetAccessIcon';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ThreadTitleBar = ({ community }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderButtonContent = () => {
    if (community.is_author) {
      return isHovered ? 'Delete' : 'Created';
    } else {
      return isHovered ? 'Leave' : 'Joined';
    }
  };

  const handleTitleClick = () => {
    alert('Are you sure ?');
  };

  return (
    <Card
      sx={{
        p: 2,
        mb: 1.5,
      }}
      elevation={0}
    >
      <Grid container gap={4} alignItems={'center'}>
        <Grid item xs={1}>
          <Avatar
            sx={{
              bgcolor: '#090979',
              width: '4rem',
              height: '4rem',
              color: 'paper',
            }}
          >
            {community.icon &&
              React.cloneElement(community.icon, {
                sx: { fontSize: '3rem', color: 'paper' },
              })}
          </Avatar>
        </Grid>
        <Grid item xs={8} alignItems={'center'}>
          <Typography variant="title" fontWeight={'bold'}>
            {community.title}
            <Tooltip
              sx={{ mx: 1 }}
              title={getAccessIcon(community.access_type).message}
            >
              {getAccessIcon(community.access_type).icon}
            </Tooltip>
          </Typography>
          <Divider />
          <Typography
            variant="caption"
            sx={{ display: 'block', color: 'gray' }}
          >
            c/{community.name}
          </Typography>
          <Typography variant="caption" component={'h1'}>
            Created by u/{community.author_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <FiberManualRecordRoundedIcon
              color="success"
              fontSize="8px"
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" color={'GrayText'}>
              {community.total_joined_users} Members
            </Typography>
          </Box>
          <Box sx={{ mt: 0.5 }}>
            <Button onClick={handleOpen} size="small">
              Learn more
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                  About the community
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {community.description}
                </Typography>
              </Box>
            </Modal>
          </Box>
        </Grid>
        <Grid item xs={1} alignItems={'center'}>
          <Button
            variant="contained"
            size="small"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleTitleClick}
          >
            {renderButtonContent()}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ThreadTitleBar;
