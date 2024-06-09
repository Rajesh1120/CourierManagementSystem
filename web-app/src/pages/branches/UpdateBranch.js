import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const UpdateBranch = () => {
  const navigate = useNavigate();
  const { id: branchId } = useParams();

  const [branchData, setBranchData] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
    contact: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    street: false,
    city: false,
    state: false,
    zipcode: false,
    contact: false,
  });

  useEffect(() => {
    async function fetchBranch() {
      try {
        const response = await api.get(`/branches/${branchId}`);
        const { _id, branch_code, street, city, state, zipcode, contact } =
          response.data;
        setBranchData({
          _id,
          branch_code,
          street,
          city,
          state,
          zipcode,
          contact,
        });
      } catch (error) {
        console.error("Failed to fetch branch:", error);
      }
    }

    fetchBranch();
  }, [branchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update error state for empty fields
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value === "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const errors = {};
    Object.keys(branchData).forEach((key) => {
      if (!branchData[key]) {
        errors[key] = true;
      }
    });

    // Zip Code validation: Allow only numbers
    if (branchData.zipcode && !/^\d+$/.test(branchData.zipcode)) {
      errors.zipcode = true;
    }

    // Contact (Mobile number) validation: Allow only numbers and must be 10 digits
    if (
      branchData.contact &&
      (!/^\d+$/.test(branchData.contact) || branchData.contact.length !== 10)
    ) {
      errors.contact = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await api.put(`/branches/${branchId}`, branchData);
      navigate("/admin/branches");
    } catch (error) {
      console.error("Failed to update branch:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          marginTop: "2rem",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Update Branch
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Street"
            name="street"
            variant="outlined"
            margin="normal"
            fullWidth
            error={fieldErrors.street}
            helperText={fieldErrors.street && "Street is required"}
            value={branchData.street}
            onChange={handleChange}
          />
          <TextField
            label="City"
            name="city"
            variant="outlined"
            margin="normal"
            fullWidth
            error={fieldErrors.city}
            helperText={fieldErrors.city && "City is required"}
            value={branchData.city}
            onChange={handleChange}
          />
          <TextField
            label="State"
            name="state"
            variant="outlined"
            margin="normal"
            fullWidth
            error={fieldErrors.state}
            helperText={fieldErrors.state && "State is required"}
            value={branchData.state}
            onChange={handleChange}
          />
          <TextField
            label="Zip Code"
            name="zipcode"
            variant="outlined"
            margin="normal"
            fullWidth
            error={fieldErrors.zipcode}
            helperText={
              fieldErrors.zipcode
                ? "Zip Code is required and must be a number"
                : ""
            }
            value={branchData.zipcode}
            onChange={handleChange}
          />
          <TextField
            label="Contact"
            name="contact"
            variant="outlined"
            margin="normal"
            fullWidth
            error={fieldErrors.contact}
            helperText={
              fieldErrors.contact
                ? "Contact is required and must be a 10-digit number"
                : ""
            }
            value={branchData.contact}
            onChange={handleChange}
          />
          <br />
          <br />
          <Button
            style={{ height: 45 }}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Update Branch
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UpdateBranch;
