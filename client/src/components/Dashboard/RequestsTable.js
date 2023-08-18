import React from 'react';
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
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

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

const RequestsTable = ({
  requests,
  handleApprove,
  handleReject,
  isLoading,
}) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ width: '100%' }} textAlign="left">
        <Typography variant="h5" gutterBottom fontWeight={'bold'}>
          Join Requests
        </Typography>
      </Divider>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {requests.length === 0 ? (
            <Alert severity="info">No join requests available.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Community</StyledTableCell>
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

export default RequestsTable;
