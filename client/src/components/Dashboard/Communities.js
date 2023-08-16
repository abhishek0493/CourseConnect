import React from 'react';
import { makeStyles } from '@mui/styles';

import {
  Paper,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Chip,
  Link,
  Divider,
} from '@mui/material';

import AcUnitIcon from '@mui/icons-material/AcUnit';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

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
    marginTop: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateRandomCommunities = (numCommunities) => {
  const communities = [];

  for (let i = 1; i <= numCommunities; i++) {
    const createdAt = randomDate(new Date(2023, 0, 1), new Date());
    const numThreads = Math.floor(Math.random() * 20) + 1;

    communities.push({
      id: i,
      name: `Community ${i}`,
      createdBy: `User ${i}`,
      createdAt: createdAt.toDateString(),
      numThreads,
    });
  }

  return communities;
};

const Communities = ({ communities }) => {
  const classes = useStyles();

  const communitiesData = generateRandomCommunities(3); // Generate 10 random communities

  return (
    <>
      <Divider sx={{ my: 3 }} textAlign="left">
        <Typography variant="body1" fontWeight={'bold'}>
          # Recently Created Communities
        </Typography>
      </Divider>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
        {communitiesData.map((community) => (
          <Paper key={community.id} elevation={0} className={classes.root}>
            <div className={classes.communityInfo}>
              <Link
                component="button"
                variant="subtitle2"
                fontWeight={'bold'}
                className={classes.communityName}
                onClick={() => {
                  console.info("I'm a button.");
                }}
              >
                c/node.js-backend
              </Link>
            </div>
            <Chip size="small" label="Science & Tech"></Chip>
            <Divider />
            <div className={classes.icons}>
              <Tooltip title="Total Members">
                <Avatar
                  className={classes.icon}
                  sx={{
                    width: '20px',
                    height: '20px',
                    bgcolor: 'primary.main',
                  }}
                >
                  <AccountCircleRoundedIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              </Tooltip>
              <Tooltip title="Total Threads Created">
                <Avatar
                  className={classes.icon}
                  sx={{
                    width: '20px',
                    height: '20px',
                    bgcolor: 'primary.main',
                  }}
                >
                  <AcUnitIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              </Tooltip>
            </div>
          </Paper>
        ))}
      </div>
    </>
  );
};

export default Communities;
