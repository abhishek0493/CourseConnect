import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Divider,
  List,
  Avatar,
  Alert,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';

import ArrowRight from '@mui/icons-material/ArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import { useNavigate } from 'react-router-dom';

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

const Sidebar = ({ communities }) => {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider
        theme={createTheme({
          palette: {
            primary: {
              main: '#4f4fab',
              dark: '#2e2e78',
            },
            secondary: {
              main: '#E6EDFF',
              dark: '#E5E5E5',
            },
            action: {
              main: 'orangered',
            },
          },
          components: {
            MuiListItemText: {
              styleOverrides: {
                root: {
                  fontSize: '3rem !important',
                },
              },
            },
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
                pb: open ? 2 : 0,
                height: '85vh',
                overflowY: 'auto', // Add this to make the content scrollable
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
                  primary="Your Communities"
                  primaryTypographyProps={{
                    fontSize: 12,
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
              {open && communities !== null ? (
                communities.length > 0 ? (
                  communities.map((item) => (
                    <ListItemButton
                      key={item.id}
                      sx={{ py: 1, minHeight: 32 }}
                      onClick={() => {
                        navigate(`/dashboard/c/${item.name}`);
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: '#090979',
                            // border: '2px solid #2e2e78',
                            color: 'paper',
                            p: 1.5,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={`c/${item.name}`}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: 'medium',
                        }}
                      />
                    </ListItemButton>
                  ))
                ) : (
                  <Alert severity="info">
                    No communities created or joined!
                  </Alert>
                )
              ) : null}
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
};

export default Sidebar;
