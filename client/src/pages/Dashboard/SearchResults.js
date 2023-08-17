import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Divider, Typography, Box, Alert, Stack } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import ParentContext from '../../ParentContext';
import { Refactor } from '../../components/Constants/Refactor';
import ThreadCard from '../../components/Thread/ThreadCard';
import axios from 'axios';
import DashboardThreads from '../../components/Dashboard/DashboardThreads';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const SearchResults = () => {
  const { baseUrl } = useContext(ParentContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  const [threads, setThreads] = useState([]);

  const fetchThreadResults = async () => {
    axios
      .get(`${baseUrl}/api/v1/dashboard/search-threads?query=${query}`)
      .then((res) => {
        if (res.data.success) {
          const response = Refactor(res.data);
          const resWithIcons = AddCategoryIcon(response);
          setThreads(resWithIcons);
        }
      });
  };

  useEffect(() => {
    fetchThreadResults();
  }, [location]);

  return (
    <>
      <Divider textAlign="left">
        <Typography variant="subtitle2" fontWeight={'bold'}>
          Search Results for "{query}"
        </Typography>
      </Divider>
      <Box sx={{ mt: 2 }}>
        {threads.length === 0 ? (
          <>
            <Alert severity="warning" icon={<InfoOutlined />}>
              No Results found.
            </Alert>
          </>
        ) : (
          <Stack spacing={2}>
            {threads.map((item) => (
              <DashboardThreads thread={item} isNavigated={true} />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default SearchResults;
