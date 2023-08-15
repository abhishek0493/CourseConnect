import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Refactor } from '../../components/Constants/Refactor';
import RequestsTable from '../../components/Dashboard/RequestsTable';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJoinRequests = async () => {
    axios
      .get(`http://localhost:8000/api/v1/users/community/view-all-requests`, {
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
      .get(
        `http://localhost:8000/api/v1/users/community/request/${requestId}/approve`,
        { withCredentials: true }
      )
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
      .get(
        `http://localhost:8000/api/v1/users/community/request/${requestId}/reject`,
        { withCredentials: true }
      )
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

export default Requests;
