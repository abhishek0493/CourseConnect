import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Grid,
  Divider,
  Button,
  Modal,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';

import { getAccessIcon } from '../Constants/GetAccessIcon';
import Diversity2TwoToneIcon from '@mui/icons-material/Diversity2TwoTone';
import GroupWorkTwoToneIcon from '@mui/icons-material/GroupWorkTwoTone';
import AllOutTwoToneIcon from '@mui/icons-material/AllOutTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import axios from 'axios';
import ParentContext from '../../ParentContext';

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

const ThreadTitleBar = ({ community, isCommunityJoined }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [joined, setJoined] = useState(community.is_joined);

  const { baseUrl } = useContext(ParentContext);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const accessStyle = getAccessIcon(community.access_type);

  const renderButtonContent = () => {
    if (community.is_author) {
      return {
        message: 'Created',
        color: 'primary',
        clickable: false,
      };
    } else if (!community.allow_access) {
      return {
        message: 'Reqeust Pending',
        color: 'warning',
        clickable: false,
      };
    } else if (!community.is_joined) {
      return {
        message: 'Join',
        color: 'primary',
        clickable: true,
      };
    } else {
      return {
        message: 'Joined',
        color: 'success',
        clickable: false,
      };
    }
  };

  const action = renderButtonContent();

  const handleJoin = async () => {
    await axios
      .get(`${baseUrl}/api/v1/community/${community.id}/join`)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.data.message);
          isCommunityJoined(true);
          navigate(`/dashboard/c/${res.data.data.name}`);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          alert(response.data.message);
        }
      });
  };

  const handleTitleClick = () => {
    alert('Are you sure ?');
  };

  return (
    <Box sx={{ p: 2, mb: 1.5, width: '100%' }}>
      <Grid container>
        <Grid item xs={9}>
          <Divider sx={{ width: '100%' }} textAlign="left">
            <Typography variant="h5" fontWeight={'bold'}>
              {community.title}
            </Typography>
          </Divider>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Chip
            variant="outlined"
            onClick={community.message == 'Join' ? handleJoin : undefined}
            label={community.message}
          ></Chip>
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 0.5 }}>
        <Grid item xs={12}>
          <Typography variant="caption" component={'p'} sx={{ ml: 3 }}>
            c/{community.name}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', columnGap: 1 }}>
          <Box>
            <Tooltip sx={{ mx: 1 }} title={accessStyle.message}>
              <Chip
                variant="contained"
                label={`${accessStyle.type} community`}
                icon={accessStyle.icon}
                color="secondary"
              ></Chip>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Total members">
              <Chip
                icon={<GroupWorkTwoToneIcon color="primary" />}
                color="secondary"
                label={
                  <Typography variant="subtitle2">
                    {community.total_joined_users}
                  </Typography>
                }
                variant="contained"
              />
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            columnGap: 2,
          }}
        >
          <Box>
            <Chip
              onClick={handleOpen}
              icon={<AllOutTwoToneIcon color="primary" />}
              label={<Typography variant="subtitle2">Learn more</Typography>}
              variant="container"
              color="secondary"
            />

            {/* Description Modal */}
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
            {/* Desc Modal ends */}
          </Box>
          <Box>
            {community &&
              community.is_author == 1 &&
              (community.access_type == 2 || community.access_type == 3) && (
                <Chip
                  icon={<ErrorTwoToneIcon color="primary" />}
                  color="secondary"
                  onClick={() =>
                    navigate(`/dashboard/${community.name}/view-requests`)
                  }
                  label={
                    <Typography variant="subtitle2">
                      View Join requests
                    </Typography>
                  }
                  variant="contained"
                />
              )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ThreadTitleBar;
