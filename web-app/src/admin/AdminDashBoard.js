import React from "react";
import styled from "styled-components";
import toast from "react-hot-toast"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)`
  padding: 32px;
`;

const StaffCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f7f7f7;
  border-radius: 10px;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BranchCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #e8f7ff;
  border-radius: 10px;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledCardContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledTypography = styled(Typography)`
  text-align: center;
  margin-bottom: 8px;
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
`;

const AdminDashBoard = () => {
  const navigate = useNavigate();
  return (
    
    <StyledBox>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StaffCard onClick={() => navigate("/admin/staff-list")}>
            <StyledCardContent>
              <StyledTypography variant="h5" component="h2">
                Staff
              </StyledTypography>
              <StyledTypography variant="body2" component="p">
                Manage staff and their profiles
              </StyledTypography>
            </StyledCardContent>
            <StyledButton variant="outlined" color="primary">
              View Staff
            </StyledButton>
          </StaffCard>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <BranchCard onClick={() => navigate("/admin/branches")}>
            <StyledCardContent>
              <StyledTypography variant="h5" component="h2">
                Branches
              </StyledTypography>
              <StyledTypography variant="body2" component="p">
                Manage Branches
              </StyledTypography>
            </StyledCardContent>
            <StyledButton variant="outlined" color="primary">
              View Branches
            </StyledButton>
          </BranchCard>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default AdminDashBoard;
