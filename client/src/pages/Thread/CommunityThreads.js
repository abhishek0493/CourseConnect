import React from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { useNavigate, useOutlet, useOutletContext } from 'react-router-dom';
import image from './empty2.svg';
import ThreadCard from '../../components/Thread/ThreadCard';

const CommunityThreads = () => {
  const [threads, setThreads] = useOutletContext();

  return (
    <Box>
      {threads.length === 0 ? (
        <>
          <Alert severity="warning" icon={<InfoOutlined />}>
            No threads created in this community yet!
          </Alert>
          <img
            src={image}
            style={{
              width: '55%',
              display: 'block',
              margin: '0 auto',
            }}
          ></img>
        </>
      ) : (
        <Stack spacing={2}>
          {threads.map((item) => (
            <ThreadCard thread={item} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommunityThreads;
