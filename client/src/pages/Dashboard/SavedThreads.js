import React, { useContext, useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import ThreadCard from '../../components/Thread/ThreadCard';
import { Box, Divider, Typography, Alert, Stack } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import axios from 'axios';
import ParentContext from '../../ParentContext';
import { Refactor } from '../../components/Constants/Refactor';

const SavedThreads = () => {
  const { baseUrl } = useContext(ParentContext);
  const [threads, setThreads] = useState([]);

  const fetchSavedThreads = async () => {
    await axios
      .get(`${baseUrl}/api/v1/dashboard/get-saved-threads`)
      .then((res) => {
        if (res.data.success) {
          const response = Refactor(res.data);
          setThreads(response);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    fetchSavedThreads();
  }, []);

  return (
    <>
      <CreatePostBar />
      <Box sx={{ mt: 2 }}>
        <Divider textAlign="left">
          <Typography variant="h5" fontWeight={'bold'}>
            # Saved Threads
          </Typography>
        </Divider>
        <Box sx={{ mt: 2 }}>
          {threads.length === 0 ? (
            <>
              <Alert severity="warning" icon={<InfoOutlined />}>
                You have not saved any threads yet!
              </Alert>
            </>
          ) : (
            <Stack spacing={2}>
              {threads.map((item) => (
                <ThreadCard thread={item} isAllSaved={true} />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SavedThreads;
