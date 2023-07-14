import React from 'react';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

export const Categories = [
  {
    id: 1,
    icon: <PsychologyTwoToneIcon />,
    label: 'Science & Tech',
    route: 'science-tech',
  },
  {
    id: 2,
    icon: <BusinessCenterTwoToneIcon />,
    label: 'Business and Entrepreneurship',
    route: 'business-entrepreneurship',
  },
  {
    id: 3,
    icon: <ColorLensTwoToneIcon />,
    label: 'Creative Arts',
    route: 'creative-arts',
  },
  {
    id: 4,
    icon: <SettingsAccessibilityIcon />,
    label: 'Personal Development',
    route: 'personal-development',
  },
  {
    id: 5,
    icon: <TranslateTwoToneIcon />,
    label: 'Language Learning',
    route: 'language-learning',
  },
];
