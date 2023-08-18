import React from 'react';

import SupervisedUserCircleTwoToneIcon from '@mui/icons-material/SupervisedUserCircleTwoTone';
import LockPersonTwoToneIcon from '@mui/icons-material/LockPersonTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';

export const getAccessIcon = (type) => {
  let icon = null;
  let message = '';
  let color = '';
  switch (type) {
    case 1:
      icon = <SupervisedUserCircleTwoToneIcon htmlColor="green" />;
      message =
        'This community is open. Anyone can join and post in this community';
      color = 'success';
      type = 'Public';
      break;
    case 2:
      icon = <LockPersonTwoToneIcon htmlColor="orange" />;
      message =
        'This community is restricted. Threads can be viewed but requires creator approval for posting in this community';
      color = 'warning';
      type = 'Restricted';

      break;
    case 3:
      icon = <LockTwoToneIcon htmlColor="red" />;
      message =
        'This community is protected. Viewing and creating threads requires creator approval';
      color = 'danger';
      type = 'Private';

      break;
    default:
      break;
  }
  return {
    icon: icon,
    message: message,
    color: color,
    type: type,
  };
};
