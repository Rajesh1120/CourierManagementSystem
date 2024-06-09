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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StaffList = () => {
  const navigate = useNavigate();

  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    async function fetchStaffMembers() {
      try {
        const response = await api.get("/staff");
        setStaffMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch staff members:", error);
      }
    }

    fetchStaffMembers();
  }, []);

  const handleDelete = async (staffId) => {
    try {
      await api.delete(`/staff/${staffId}`);
      // Update the staff members state to remove the deleted staff
      setStaffMembers((prevStaffMembers) =>
        prevStaffMembers.filter((staff) => staff._id !== staffId)
      );
    } catch (error) {
      console.error("Failed to delete staff member:", error);
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <FlexContainer>
        <Typography variant="h4" gutterBottom>
          List of Staff Members
        </Typography>
        <CreateButton
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/staff-list/create-staff")}
        >
          Create New Staff
        </CreateButton>
      </FlexContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Id</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Address</strong>
              </TableCell>
              <TableCell>
                <strong>Branch</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell align="left">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff._id}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.address}</TableCell>
                <TableCell>
                  {staff.branch_id ? (
                    <>
                      {`${staff.branch_id.branch_code} - ${staff.branch_id.street}, ${staff.branch_id.city}, ${staff.branch_id.state}`}
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{staff.type ? staff.type : "frontend"}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/admin/staff-list/${staff._id}/update-staff`}
                      style={{ textDecoration: "none" }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(staff._id)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledContainer>
  );
};

export default StaffList;
