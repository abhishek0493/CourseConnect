import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowRight from '@mui/icons-material/ArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Settings from '@mui/icons-material/Settings';
import People from '@mui/icons-material/People';
import PermMedia from '@mui/icons-material/PermMedia';
import Dns from '@mui/icons-material/Dns';
import Public from '@mui/icons-material/Public';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import { useNavigate } from 'react-router-dom';

const data = [
  { icon: <People />, label: 'Science & Technology' },
  { icon: <Dns />, label: 'Business & Entreprenuership' },
  { icon: <PermMedia />, label: 'Creative Arts' },
  { icon: <Public />, label: 'Language Learning' },
];

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
        })}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 256,
            flexShrink: 0,
            position: 'fixed',
          }}
        >
          <FireNav component="nav" disablePadding>
            {/* <ListItemButton component="a" href="#customized-list">
              <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
              <ListItemText
                sx={{ my: 0 }}
                primary="CourseConnect"
                primaryTypographyProps={{
                  fontSize: 20,
                  fontWeight: 'medium',
                  letterSpacing: 0,
                }}
              />
            </ListItemButton> */}
            <Divider />
            <ListItem component="div" disablePadding>
              <ListItemButton
                sx={{ height: 30 }}
                onClick={() => navigate('create-community')}
              >
                <ListItemIcon>
                  <AddCircleIcon color="#333333" />
                </ListItemIcon>
                <ListItemText
                  primary="Create Community"
                  primaryTypographyProps={{
                    fontWeight: 'medium',
                    variant: 'body2',
                  }}
                />
              </ListItemButton>
              <Tooltip title="View All Communities">
                <IconButton
                  size="large"
                  sx={{
                    '& svg': {
                      color: '#333333',
                      transition: '0.2s',
                      transform: 'translateX(0) rotate(0)',
                    },
                    '&:hover, &:focus': {
                      bgcolor: 'unset',
                      '& svg:first-of-type': {
                        transform: 'translateX(-4px) rotate(-20deg)',
                      },
                      '& svg:last-of-type': {
                        right: 0,
                        opacity: 1,
                      },
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      height: '80%',
                      display: 'block',
                      left: 0,
                      width: '1px',
                      bgcolor: 'divider',
                    },
                  }}
                >
                  <GridViewIcon />
                  <ArrowRight
                    sx={{ position: 'absolute', right: 4, opacity: 0 }}
                  />
                </IconButton>
              </Tooltip>
            </ListItem>
            <Divider />
            <Box
              sx={{
                bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null,
                pb: open ? 2 : 0,
                height: '85vh',
              }}
            >
              <ListItemButton
                alignItems="flex-start"
                onClick={() => setOpen(!open)}
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: open ? 0 : 2.5,
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                }}
              >
                <ListItemText
                  primary="Build"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 'medium',
                    lineHeight: '20px',
                    mb: '2px',
                  }}
                  secondary="Authentication, Firestore Database, Realtime Database, Storage, Hosting, Functions, and Machine Learning"
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                  }}
                  sx={{ my: 0 }}
                />
                <KeyboardArrowDown
                  sx={{
                    mr: -1,
                    opacity: 0,
                    transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                    transition: '0.2s',
                  }}
                />
              </ListItemButton>
              {open &&
                data.map((item) => (
                  <ListItemButton
                    key={item.label}
                    sx={{ py: 2, minHeight: 32, color: '#333333' }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#333333',
                      }}
                    />
                  </ListItemButton>
                ))}
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
