import React from 'react';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

export const AddCategoryIcon = (data) => {
  const processData = (item) => {
    let icon = null;

    switch (item.category_id) {
      case 1:
        icon = <PsychologyTwoToneIcon />;
        break;
      case 2:
        icon = <BusinessCenterTwoToneIcon />;
        break;
      case 3:
        icon = <ColorLensTwoToneIcon />;
        break;
      case 4:
        icon = <SettingsAccessibilityIcon />;
        break;
      case 5:
        icon = <TranslateTwoToneIcon />;
        break;
      default:
        break;
    }

    item.icon = icon;
    return item;
  };

  if (Array.isArray(data)) {
    // If data is an array of objects
    return data.map((item) => processData(item));
  } else if (typeof data === 'object') {
    // If data is a single object
    return processData(data);
  }

  return null; // Return null for invalid data types
};
