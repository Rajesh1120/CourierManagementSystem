import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const ParcelDetails = ({ parcel }) => {
  const { isAuthenticated } = useAuth();
  const showAdditionalTransitDetails = parcel?.status === "Delivered";
  const transitObj = showAdditionalTransitDetails
    ? parcel.transit_details[0]
    : {};
  if (!parcel) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parcel Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Parcel Id:</strong>
              </TableCell>
              <TableCell>{parcel._id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Sender Name:</strong>
              </TableCell>
              <TableCell>{parcel.sender_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Receiver Name:</strong>
              </TableCell>
              <TableCell>{parcel.receiver_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Type:</strong>
              </TableCell>
              <TableCell>{parcel.type}</TableCell>
            </TableRow>
            {isAuthenticated() && (
              <>
                <TableRow>
                  <TableCell>
                    <strong>Sender Addres:</strong>
                  </TableCell>
                  <TableCell>{parcel.sender_address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Receiver Address:</strong>
                  </TableCell>
                  <TableCell>{parcel.receiver_address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Price:</strong>
                  </TableCell>
                  <TableCell>{parcel.price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Payment Method:</strong>
                  </TableCell>
                  <TableCell>{parcel.payment_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Payment Status:</strong>
                  </TableCell>
                  <TableCell>{parcel.payment_status}</TableCell>
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell>
                <strong>Sent Date:</strong>
              </TableCell>
              <TableCell>
                {parcel.date &&
                  moment(parcel.date).format("YYYY-MM-DD HH:mm:ss")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Status:</strong>
              </TableCell>
              <TableCell>
                {parcel?.status === "Delivered" ? "Delivered" : "In Transit"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Transit Details</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>From Branch</strong>
                </TableCell>
                <TableCell>
                  <strong>To Branch</strong>
                </TableCell>
                <TableCell>
                  <strong>Timestamp</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showAdditionalTransitDetails && (
                <TableRow>
                  <TableCell>
                    {transitObj.to_branch_id.street},{" "}
                    {transitObj.to_branch_id.city},{" "}
                    {transitObj.to_branch_id.state}
                  </TableCell>
                  <TableCell>{parcel.receiver_address}</TableCell>
                  <TableCell>
                    {moment(parcel.date).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
              )}
              {parcel.transit_details?.map((transit, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {transit.from_branch_id.street},{" "}
                    {transit.from_branch_id.city},{" "}
                    {transit.from_branch_id.state}
                  </TableCell>
                  <TableCell>
                    {transit.to_branch_id.street}, {transit.to_branch_id.city},{" "}
                    {transit.to_branch_id.state}
                  </TableCell>
                  <TableCell>
                    {moment(transit.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ParcelDetails;
