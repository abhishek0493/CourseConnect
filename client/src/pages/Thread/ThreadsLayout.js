import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CreatePostBar from '../../components/Common/CreatePostBar';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import ThreadTitleBar from '../../components/Thread/ThreadTitleBar';
import axios from 'axios';
import { Refactor } from '../../components/Constants/Refactor';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';

const ThreadsLayout = () => {
  const { name } = useParams();
  const location = useLocation();
  const [threads, setThreads] = useState([]);
  const [community, setCommunity] = useState([]);

  const fetchCommunityDetails = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/community/${name}`)
      .then((res) => {
        if (res.data.success) {
          const result = Refactor(res.data);
          const resultWithIcon = AddCategoryIcon(result);
          setCommunity(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCommunityThreads = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/threads/${name}/get-threads`)
      .then((res) => {
        if (res.data.success) {
          const result = Refactor(res.data);
          const resultWithIcons = AddCategoryIcon(result);
          setThreads(resultWithIcons);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCommunityThreads();
    fetchCommunityDetails();
  }, [location]);

  return (
    <Box>
      <ThreadTitleBar name={name} community={community} />
      <CreatePostBar community={community} />
      <Box sx={{ my: 2 }}>
        <Outlet context={[threads, setThreads]} />
      </Box>
    </Box>
  );
};

export default ThreadsLayout;
