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

const BranchList = () => {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await api.get("/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    }

    fetchBranches();
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <FlexContainer>
        <Typography variant="h4" gutterBottom>
          <strong>List of Branches</strong>
        </Typography>
        <CreateButton
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/branches/create-branch")}
        >
          Create New Branch
        </CreateButton>
      </FlexContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Branch Code</strong>
              </TableCell>
              <TableCell>
                <strong>Street</strong>
              </TableCell>
              <TableCell>
                <strong>City</strong>
              </TableCell>
              <TableCell>
                <strong>State</strong>
              </TableCell>
              <TableCell>
                <strong>Zip Code</strong>
              </TableCell>
              <TableCell>
                <strong>Contact</strong>
              </TableCell>
              <TableCell>
                <strong>Parcels</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch._id}>
                <TableCell>{branch.branch_code}</TableCell>
                <TableCell>{branch.street}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.state}</TableCell>
                <TableCell>{branch.zipcode}</TableCell>
                <TableCell>{branch.contact}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigate(`/admin/branches/${branch._id}/parcels`)
                    }
                  >
                    View Parcels
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigate(`/admin/branches/${branch._id}/update-branch`)
                    }
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledContainer>
  );
};

export default BranchList;
