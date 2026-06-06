import React, { useContext, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import SecondarySidebar from './Dashboard/SecondarySidebar';
import ParentContext from '../ParentContext';
import MenuIcon from '@mui/icons-material/Menu';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: '280px',
    flexShrink: 0,
    position: 'fixed',
    top: theme.spacing(8),
    bottom: 0,
  },
  content: {
    flexGrow: 1,
    padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
    marginLeft: '280px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      padding: theme.spacing(2),
    },
  },
  card: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    height: '500px',
  },
}));

const LayoutSecondary = ({ communities, isUpdateTrigger }) => {
  const classes = useStyles();
  const { user, setUser } = useContext(ParentContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Box sx={{ display: 'flex', bgcolor: '#DAE0E6' }}>
        {/* Desktop sidebar — visible only on md+ */}
        {!isMobile && <Sidebar communities={communities} />}

        {/* Mobile drawer */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            sx={{
              '& .MuiDrawer-paper': {
                width: 260,
                top: '64px',
                boxSizing: 'border-box',
              },
            }}
          >
            <Sidebar
              communities={communities}
              isMobile={true}
              onClose={handleDrawerToggle}
            />
          </Drawer>
        )}

        <main className={classes.content}>
          {/* Mobile hamburger button */}
          {isMobile && (
            <Box sx={{ mb: 1 }}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor: 'white',
                  boxShadow: 1,
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
                aria-label="Open sidebar menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box>
                <Outlet />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ p: { xs: 1, md: 6 } }}>
              <Card
                variant="outlined"
                sx={{ position: { xs: 'static', md: 'sticky' }, top: 80 }}
              >
                <SecondarySidebar user={user} />
              </Card>
            </Grid>
          </Grid>
        </main>
      </Box>
    </>
  );
};

export default LayoutSecondary;
