import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const StyledContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PasswordChangeContainer = styled(Box)`
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
`;

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [staffDetails, setStaffDetails] = useState({});
  const { user } = useAuth();
  const [passwordChanged, setPasswordChanged] = useState(
    user?.isPasswordChanged
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchStaffDetails() {
      try {
        const response = await api.get(`/staff/${user.user_id}`);
        setStaffDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch staff details:", error);
      }
    }

    fetchStaffDetails();
  }, [user.user_id]);

  const handlePasswordChange = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      // Send a request to update the password
      await api.put(`/staff/${user.user_id}/change-password`, {
        password,
        isPasswordChanged: "yes",
      });
      setPasswordChanged("yes");
      // Clear the password fields after successful change
      setPassword("");
      setConfirmPassword("");
      // Display a success message or handle it as you prefer
      console.log("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password:", error);
      // Handle error, display an error message, etc.
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <FlexContainer>
        <Typography variant="h4" gutterBottom>
          <strong>Welcome, {staffDetails.name}!</strong>
        </Typography>
      </FlexContainer>
      <Box>
        <Typography variant="h5" gutterBottom>
          Staff Details
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Name:</strong>
                </TableCell>
                <TableCell>{staffDetails.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Email:</strong>
                </TableCell>
                <TableCell>{staffDetails.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>User ID:</strong>
                </TableCell>
                <TableCell>{staffDetails.user_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Phone:</strong>
                </TableCell>
                <TableCell>{staffDetails.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Address:</strong>
                </TableCell>
                <TableCell>{staffDetails.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Branch:</strong>
                </TableCell>
                <TableCell>
                  {staffDetails.branch ? (
                    <>
                      {staffDetails.branch.street}, {staffDetails.branch.city},{" "}
                      {staffDetails.branch.state}, {staffDetails.branch.zipcode}
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {user?.isPasswordChanged === "yes" || passwordChanged === "yes" ? (
          <></>
        ) : (
          <PasswordChangeContainer>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              inputProps={{ maxLength: 20 }}
              error={password === ""}
              helperText={password === "" ? "Password cannot be empty" : ""}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={confirmPassword}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              inputProps={{ maxLength: 20 }}
              error={confirmPassword === "" || password !== confirmPassword}
              helperText={
                confirmPassword === ""
                  ? "Confirm password cannot be empty"
                  : password !== confirmPassword
                  ? "Passwords do not match"
                  : ""
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </PasswordChangeContainer>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/staff/parcels")}
        sx={{ marginTop: 2 }}
      >
        View Parcels
      </Button>
    </StyledContainer>
  );
};

export default StaffDashboard;
