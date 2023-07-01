import PsychologyIcon from '@mui/icons-material/Psychology';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import GTranslateIcon from '@mui/icons-material/GTranslate';

export const navbarItems = [
  {
    id: 1,
    icon: <PsychologyIcon />,
    label: 'Science & Tech',
    route: 'science-tech',
  },
  {
    id: 2,
    icon: <BusinessIcon />,
    label: 'Business and Entrepreneurship',
    route: 'business-entrepreneurship',
  },
  {
    id: 3,
    icon: <EmojiObjectsIcon />,
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
    icon: <GTranslateIcon />,
    label: 'Language Learning',
    route: 'language-learning',
  },
];
