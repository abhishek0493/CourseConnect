import React from 'react';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import DrawIcon from '@mui/icons-material/Draw';
import TranslateIcon from '@mui/icons-material/Translate';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import DomainTwoToneIcon from '@mui/icons-material/DomainTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

export const Categories = [
  {
    id: 1,
    icon: <PsychologyTwoToneIcon />,
    label: 'Science & Tech',
    route: 'science-tech',
    color: '#46007A',
  },
  {
    id: 2,
    icon: <BusinessCenterTwoToneIcon />,
    label: 'Business and Entrepreneurship',
    route: 'business-entrepreneurship',
    color: '#46007A',
  },
  {
    id: 3,
    icon: <ColorLensTwoToneIcon />,
    label: 'Creative Arts',
    route: 'creative-arts',
    color: '#46007A',
  },
  {
    id: 4,
    icon: <SettingsAccessibilityIcon />,
    label: 'Personal Development',
    route: 'personal-development',
    color: '#46007A',
  },
  {
    id: 5,
    icon: <TranslateTwoToneIcon />,
    label: 'Language Learning',
    route: 'language-learning',
    color: '#46007A',
  },
];
