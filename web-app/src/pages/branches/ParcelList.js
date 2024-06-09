import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box, // Import Box component
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";

const StyledContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateButton = styled(Button)`
  margin-bottom: 20px;
`;

const ParcelList = ({}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [parcels, setParcels] = useState([]);
  const { isAdmin, isStaff, user } = useAuth();

  useEffect(() => {
    async function fetchParcels() {
      const branchId = isAdmin() ? id : user?.branch?._id;
      try {
        const response = await api.get(`/branches/${branchId}/parcels`);
        setParcels(response.data);
      } catch (error) {
        console.error("Failed to fetch parcels:", error);
      }
    }

    fetchParcels();
  }, []);

  const finalData =
    user?.type === "backend"
      ? parcels.filter((obj) => obj.status !== "Delivered")
      : parcels;

  return (
    <StyledContainer maxWidth="lg">
      <FlexContainer>
        <Typography variant="h4" gutterBottom>
          <strong>List of Parcels</strong>
        </Typography>
        {!isAdmin() && user?.type === "frontend" && (
          <CreateButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/staff/parcels/create-parcel")}
          >
            Create New Parcel
          </CreateButton>
        )}
      </FlexContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Id</strong>
              </TableCell>
              <TableCell>
                <strong>Sender Name</strong>
              </TableCell>
              <TableCell>
                <strong>Receiver Name</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Sender Address</strong>
              </TableCell>
              <TableCell>
                <strong>Receiver Address</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Sent Date</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finalData.map((parcel) => (
              <TableRow key={parcel._id}>
                <TableCell>{parcel._id}</TableCell>
                <TableCell>{parcel.sender_name}</TableCell>
                <TableCell>{parcel.receiver_name}</TableCell>
                <TableCell>{parcel.type}</TableCell>
                <TableCell>{parcel.sender_address}</TableCell>
                <TableCell>{parcel.receiver_address}</TableCell>
                <TableCell>{parcel.price}</TableCell>
                <TableCell>
                  {moment(parcel.date).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {parcel.status !== "Delivered" ? "In Transit" : "Delivered"}
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Link
                      to={
                        isAdmin()
                          ? `/admin/branches/${id}/parcels/${parcel._id}/details`
                          : `/staff/parcels/${parcel._id}/details`
                      }
                      style={{ textDecoration: "none", marginRight: "10px" }}
                    >
                      <Button variant="outlined" size="small">
                        View
                      </Button>
                    </Link>
                    {isStaff() &&
                      parcel?.status !== "Delivered" &&
                      user?.type === "backend" && (
                        <Link
                          to={`/staff/parcels/${parcel._id}/update-parcel`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Update
                          </Button>
                        </Link>
                      )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledContainer>
  );
};

export default ParcelList;
