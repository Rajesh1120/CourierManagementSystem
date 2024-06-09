import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast'

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const CreateStaff = () => {
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    branch_id: "",
    type: "", // Added staff type (role)
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    address: false,
    branch_id: false,
    type: false,
  });

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

  const handleChange = (name, value) => {
    setStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    Object.keys(staffData).forEach((key) => {
      if (!staffData[key]) {
        errors[key] = true;
      }
    });

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(staffData.email)) {
      errors.email = true;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(staffData.phone)) {
      errors.phone = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await api.post("/staff", staffData);
      toast.success("Succesfully Staff is Created ")
      navigate("/admin/staff-list");
     
      

    } catch (error) {
      console.error("Failed to create staff member:", error);
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
          Create New Staff Member
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={fieldErrors.name}
            helperText={fieldErrors.name && "Name is required"}
            value={staffData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={fieldErrors.email}
            helperText={
              fieldErrors.email ? "Email is required and must be valid" : " "
            }
            value={staffData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <TextField
            label="Phone"
            name="phone"
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={fieldErrors.phone}
            helperText={
              fieldErrors.phone
                ? "Phone is required and must be a 10-digit number"
                : " "
            }
            value={staffData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={fieldErrors.password}
            helperText={fieldErrors.password && "Password is required"}
            value={staffData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <TextField
            label="Address"
            name="address"
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={fieldErrors.address}
            helperText={fieldErrors.address && "Address is required"}
            value={staffData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="branch_id" shrink>
              Select Branch
            </InputLabel>
            <Autocomplete
              id="branch_id"
              options={branches}
              getOptionLabel={(option) =>
                `${option.branch_code} - ${option.street}, ${option.city}, ${option.state}`
              }
              value={branches.find(
                (branch) => branch._id === staffData.branch_id
              )}
              onChange={(event, newValue) =>
                handleChange("branch_id", newValue?._id || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{ shrink: true }}
                  error={fieldErrors.branch_id}
                  helperText={fieldErrors.branch_id && "Branch is required"}
                  variant="outlined"
                  label=""
                  style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="staff_type" shrink>
              Select Staff Type (Role)
            </InputLabel>
            <TextField
              id="staff_type"
              select
              variant="outlined"
              value={staffData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              error={fieldErrors.type}
              helperText={fieldErrors.type && "Staff type is required"}
            >
              <MenuItem value="frontend">Frontend</MenuItem>
              <MenuItem value="backend">Backend</MenuItem>
            </TextField>
          </FormControl>
          <br />
          <br />
          <Button
            style={{ height: 45 }}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
          >
            Save Staff
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateStaff;
