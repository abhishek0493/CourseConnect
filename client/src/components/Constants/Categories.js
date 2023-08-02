import React from 'react';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

export const Categories = [
  {
    id: 1,
    icon: <PsychologyTwoToneIcon sx={{ mx: 1 }} />,
    label: 'Science & Tech',
    route: 'science-tech',
  },
  {
    id: 2,
    icon: <BusinessCenterTwoToneIcon sx={{ mx: 1 }} />,
    label: 'Business and Entrepreneurship',
    route: 'business-entrepreneurship',
  },
  {
    id: 3,
    icon: <ColorLensTwoToneIcon sx={{ mx: 1 }} />,
    label: 'Creative Arts',
    route: 'creative-arts',
  },
  {
    id: 4,
    icon: <SettingsAccessibilityIcon sx={{ mx: 1 }} />,
    label: 'Personal Development',
    route: 'personal-development',
  },
  {
    id: 5,
    icon: <TranslateTwoToneIcon sx={{ mx: 1 }} />,
    label: 'Language Learning',
    route: 'language-learning',
  },
];
