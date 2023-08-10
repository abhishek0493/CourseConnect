import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import axios from 'axios';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const sampleJoinRequests = [
  {
    id: 1,
    communityName: 'Tech Enthusiasts',
    communityType: 'Restricted',
    userName: 'user123',
    requestedAt: '2023-08-05T08:00:00Z',
  },
  {
    id: 2,
    communityName: 'Fitness Club',
    communityType: 'Private',
    userName: 'user456',
    requestedAt: '2023-08-05T09:30:00Z',
  },
  {
    id: 3,
    communityName: 'Book Lovers',
    communityType: 'Restricted',
    userName: 'user789',
    requestedAt: '2023-08-06T10:15:00Z',
  },
  // Add more sample requests as needed
];

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJoinRequests = async () => {
    axios
      .get('/api/join-requests')
      .then((response) => {
        setRequests(response.data);
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

  const handleApprove = (requestId) => {
    // Implement your logic to approve the join request
    console.log(`Approving request with ID ${requestId}`);
  };

  const handleReject = (requestId) => {
    // Implement your logic to reject the join request
    console.log(`Rejecting request with ID ${requestId}`);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom fontWeight={'bold'}>
        Join Requests
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Community Name</TableCell>
                  <TableCell>Community Type</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Requested At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleJoinRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.communityName}</TableCell>
                    <TableCell>{request.communityType}</TableCell>
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>{request.requestedAt}</TableCell>
                    <TableCell>
                      {/* <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(request.id)}
                        sx={{ my: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </Button> */}
                      <Tooltip title="Approve">
                        <IconButton>
                          <CheckCircleRoundedIcon color="success" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Reject">
                        <IconButton>
                          <CancelRoundedIcon color="action" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Requests;
