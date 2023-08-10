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
  Alert,
  tableCellClasses,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Refactor } from '../../components/Constants/Refactor';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.common.white,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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
        console.log(err);
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
        console.log(err);
      });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={'bold'} sx={{ mb: 2 }}>
        Join Requests
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {requests.length === 0 ? (
            <Alert severity="info">No join requests available.</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Community</StyledTableCell>
                    <StyledTableCell align="left">Access type</StyledTableCell>
                    <StyledTableCell align="left">User</StyledTableCell>
                    <StyledTableCell align="left">Requested at</StyledTableCell>
                    <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <StyledTableRow
                      key={request.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {request.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {request.access_type}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {request.request_user}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {request.created_at}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Approve">
                            <IconButton
                              onClick={() => handleApprove(request.id)}
                              sx={{ p: 0 }}
                            >
                              <CheckCircleRoundedIcon color="success" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              onClick={() => handleReject(request.id)}
                              sx={{ p: 0 }}
                            >
                              <CancelRoundedIcon color="action" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Requests;
