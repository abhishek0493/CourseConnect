import React from 'react';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import DrawIcon from '@mui/icons-material/Draw';
import TranslateIcon from '@mui/icons-material/Translate';

export const Categories = [
  {
    id: 1,
    icon: <PsychologyIcon />,
    label: 'Science & Tech',
    route: 'science-tech',
    color: '#1292E4',
  },
  {
    id: 2,
    icon: <BusinessIcon />,
    label: 'Business and Entrepreneurship',
    route: 'business-entrepreneurship',
    color: '#11C438',
  },
  {
    id: 3,
    icon: <DrawIcon />,
    label: 'Creative Arts',
    route: 'creative-arts',
    color: '#E41215',
  },
  {
    id: 4,
    icon: <SettingsAccessibilityIcon />,
    label: 'Personal Development',
    route: 'personal-development',
    color: '#00FF73',
  },
  {
    id: 5,
    icon: <TranslateIcon />,
    label: 'Language Learning',
    route: 'language-learning',
    color: '#E9BD05',
  },
];
