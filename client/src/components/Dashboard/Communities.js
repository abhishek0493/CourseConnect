import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';

import {
  Paper,
  Typography,
  Tooltip,
  Chip,
  Link,
  Box,
  Divider,
  Alert,
} from '@mui/material';

import AcUnitIcon from '@mui/icons-material/AcUnit';
import Groups3Icon from '@mui/icons-material/Groups3';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import { useNavigate } from 'react-router-dom';
import { getAccessIcon } from '../Constants/GetAccessIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    width: 'calc(33.33% - 16px)',
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  communityInfo: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  communityName: {
    marginRight: theme.spacing(1),
    fontSize: '0.5rem',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Communities = ({ communities }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <>
      <Divider sx={{ my: 3 }} textAlign="left">
        <Typography variant="h5" fontWeight={'bold'}>
          # Popular Communities
        </Typography>
      </Divider>

      {communities && communities.length === 0 && (
        <>
          <Alert severity="warning">
            No popular communities found. Be the first to create one and start a
            discussion!
          </Alert>
        </>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
        {communities &&
          communities.length > 0 &&
          communities.map((community) => {
            const accessIcon = getAccessIcon(community.access_type);
            return (
              <Paper key={community.id} elevation={0} className={classes.root}>
                <div className={classes.communityInfo}>
                  <Link
                    component="button"
                    variant="subtitle2"
                    fontWeight={'bold'}
                    className={classes.communityName}
                    onClick={() => {
                      navigate(`/dashboard/c/${community.community_name}`, {
                        replace: true,
                      });
                    }}
                  >
                    {community.community_name}
                  </Link>
                </div>
                <Box sx={{ display: 'flex' }}>
                  <Chip
                    size="small"
                    icon={community.icon}
                    label={
                      <Typography variant="caption">
                        {community.category_name}
                      </Typography>
                    }
                  ></Chip>
                </Box>
                <Divider />
                <div className={classes.icons}>
                  <Tooltip title={accessIcon.message}>
                    {accessIcon.icon}
                  </Tooltip>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <Tooltip title="Members">
                      <Chip
                        size="small"
                        icon={<Groups3Icon />}
                        label={
                          <Typography variant="caption" component={'p'}>
                            {community.total_users}
                          </Typography>
                        }
                      ></Chip>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
                    <Tooltip title="Threads Created">
                      <Chip
                        size="small"
                        icon={<DrawRoundedIcon />}
                        label={
                          <Typography variant="caption" component={'p'}>
                            {community.total_threads}
                          </Typography>
                        }
                      ></Chip>
                    </Tooltip>
                  </Box>
                </div>
              </Paper>
            );
          })}
      </div>
    </>
  );
};

export default Communities;
