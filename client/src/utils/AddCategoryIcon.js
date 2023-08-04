import React from 'react';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

export const AddCategoryIcon = (data, size = '') => {
  const processData = (item) => {
    let icon = null;

    switch (item.category_id) {
      case 1:
        icon = <PsychologyTwoToneIcon fontSize={size} />;
        break;
      case 2:
        icon = <BusinessCenterTwoToneIcon fontSize={size} />;
        break;
      case 3:
        icon = <ColorLensTwoToneIcon fontSize={size} />;
        break;
      case 4:
        icon = <SettingsAccessibilityIcon fontSize={size} />;
        break;
      case 5:
        icon = <TranslateTwoToneIcon fontSize={size} />;
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
