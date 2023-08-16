import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { Refactor } from '../../components/Constants/Refactor';
import RequestsTable from '../../components/Dashboard/RequestsTable';
import { useParams } from 'react-router-dom';
import ParentContext from '../../ParentContext';

const CommunityRequests = () => {
  const { baseUrl } = useContext(ParentContext);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { name } = useParams();

  const fetchJoinRequests = async () => {
    axios
      .get(`${baseUrl}/api/v1/users/community/view-all-requests?name=${name}`, {
        withCredentials: true,
      })
      .then((res) => {
        const result = Refactor(res.data);
        setRequests(result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching join requests:', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const handleApprove = async (requestId) => {
    await axios
      .get(`${baseUrl}/api/v1/users/community/request/${requestId}/approve`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.data.message);
          fetchJoinRequests();
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          alert(response.data.message);
        }
        // console.log(err);
      });
  };

  const handleReject = async (requestId) => {
    await axios
      .get(`${baseUrl}/api/v1/users/community/request/${requestId}/reject`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.data.message);
          fetchJoinRequests();
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          alert(response.data.message);
        }
        // console.log(err);
      });
  };

  return (
    <RequestsTable
      requests={requests}
      handleApprove={handleApprove}
      handleReject={handleReject}
    />
  );
};

export default CommunityRequests;
