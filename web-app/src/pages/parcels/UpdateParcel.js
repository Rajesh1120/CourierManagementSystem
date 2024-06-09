import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import api from "../../api/api";
import { calculatePrice } from "./util";
import { useAuth } from "../../contexts/AuthContext";

const UpdateParcel = () => {
  const { id: parcelId } = useParams(); // Get parcelId from params
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeliverEnabled, setIsDeliverEnabled] = useState(false);

  const [parcelData, setParcelData] = useState({
    sender_name: "",
    sender_address: "",
    sender_phone: "",
    receiver_name: "",
    receiver_address: "",
    receiver_phonenumber: "",
    type: "",
    from_branch_id: "",
    to_branch_id: "",
    price: "",
    length: "",
    weight: "",
    breadth: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    sender_name: false,
    sender_address: false,
    sender_phone: false,
    receiver_name: false,
    receiver_address: false,
    receiver_phonenumber: false,
    type: false,
    from_branch_id: false,
    to_branch_id: false,
    price: false,
    length: false,
    weight: false,
    breadth: false,
  });

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    async function fetchParcel() {
      // Fetch specific parcel data
      try {
        const response = await api.get(`/parcels/${parcelId}`);
        delete response.data["__v"];
        const parcel = response.data;
        setParcelData({
          ...parcel,
          price: calculatePrice({ ...parcel }),
          from_branch_id: user?.branch?._id,
        });
      } catch (error) {
        console.error("Failed to fetch parcel:", error);
      }
    }

    async function fetchBranches() {
      try {
        const response = await api.get("/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    }

    fetchParcel();
    fetchBranches();
  }, [parcelId]); // Re-fetch when parcelId changes

  useEffect(() => {
    const transit_details = parcelData.transit_details || [];
    debugger;
    if (transit_details.length > 0) {
      const toBranch = branches.find(
        (branch) => branch._id === transit_details[0]["to_branch_id"]?._id
      );
      if (toBranch)
        setIsDeliverEnabled(
          parcelData.receiver_address
            .toLowerCase()
            .includes(toBranch.state.toLowerCase())
        );
    }
  }, [parcelData.to_branch_id, branches, parcelData.receiver_address]);

  const handleChange = (name, value) => {
    const parcelDetails = { ...parcelData };
    parcelDetails[name] = value;

    setParcelData((prevData) => ({
      ...prevData,
      [name]: value,
      price: calculatePrice({ ...parcelDetails }),
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    Object.keys(parcelData).forEach((key) => {
      if (!parcelData[key]) {
        errors[key] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    delete parcelData["transit_details"];

    try {
      if (isDeliverEnabled) {
        parcelData.status = "Delivered";
      }

      await api.put(`/parcels/${parcelId}`, parcelData);
      navigate("/staff/parcels");
    } catch (error) {
      console.error("Failed to update parcel:", error);
    }
  };

  console.log("branches", JSON.stringify(branches));
  console.log("parcelData", JSON.stringify(parcelData));

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Update Parcel
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Sender Name"
                name="sender_name"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.sender_name}
                helperText={
                  fieldErrors.sender_name && "Sender name is required"
                }
                value={parcelData.sender_name}
                onChange={(e) => handleChange("sender_name", e.target.value)}
              />

              <TextField
                label="Sender Address"
                name="sender_address"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.sender_address}
                helperText={
                  fieldErrors.sender_address && "Sender address is required"
                }
                value={parcelData.sender_address}
                onChange={(e) => handleChange("sender_address", e.target.value)}
              />

              <TextField
                label="Sender Phone"
                name="sender_phone"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.sender_phone}
                helperText={
                  fieldErrors.sender_phone && "Sender phone is required"
                }
                value={parcelData.sender_phone}
                onChange={(e) => handleChange("sender_phone", e.target.value)}
              />

              <TextField
                label="Receiver Name"
                name="receiver_name"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.receiver_name}
                helperText={
                  fieldErrors.receiver_name && "Receiver name is required"
                }
                value={parcelData.receiver_name}
                onChange={(e) => handleChange("receiver_name", e.target.value)}
              />

              <TextField
                label="Receiver Address"
                name="receiver_address"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.receiver_address}
                helperText={
                  fieldErrors.receiver_address && "Receiver address is required"
                }
                value={parcelData.receiver_address}
                onChange={(e) =>
                  handleChange("receiver_address", e.target.value)
                }
              />

              <TextField
                label="Receiver Phone"
                name="receiver_phonenumber"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.receiver_phonenumber}
                helperText={
                  fieldErrors.receiver_phonenumber &&
                  "Receiver phone is required"
                }
                value={parcelData.receiver_phonenumber}
                onChange={(e) =>
                  handleChange("receiver_phonenumber", e.target.value)
                }
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="to_branch_id" shrink>
                  To Branch
                </InputLabel>
                <Autocomplete
                  id="to_branch_id"
                  options={branches}
                  getOptionLabel={(option) =>
                    `${option.branch_code} - ${option.street}, ${option.city}, ${option.state}`
                  }
                  value={
                    branches.find(
                      (branch) => branch._id === parcelData.to_branch_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange("to_branch_id", newValue?._id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      error={fieldErrors.to_branch_id}
                      helperText={
                        fieldErrors.to_branch_id && "To branch is required"
                      }
                      variant="outlined"
                      label=""
                      style={{ paddingBottom: "0.5rem" }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Type"
                name="type"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.type}
                helperText={fieldErrors.type && "Type is required"}
                value={parcelData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              />

              <TextField
                label="Price"
                name="price"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.price}
                helperText={fieldErrors.price && "Price is required"}
                value={parcelData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                disabled={true}
              />

              <TextField
                label="Breadth"
                name="breadth"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.breadth}
                helperText={fieldErrors.breadth && "Breadth is required"}
                value={parcelData.breadth}
                onChange={(e) => handleChange("breadth", e.target.value)}
              />
              <TextField
                label="Length"
                name="length"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.length}
                helperText={fieldErrors.length && "Length is required"}
                value={parcelData.length}
                onChange={(e) => handleChange("length", e.target.value)}
              />

              <TextField
                label="Weight"
                name="weight"
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.weight}
                helperText={fieldErrors.weight && "Weight is required"}
                value={parcelData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="from_branch_id" shrink>
                  From Branch
                </InputLabel>
                <Autocomplete
                  id="from_branch_id"
                  disabled={true}
                  options={branches}
                  getOptionLabel={(option) =>
                    `${option.branch_code} - ${option.street}, ${option.city}, ${option.state}`
                  }
                  value={
                    branches.find(
                      (branch) => branch._id === parcelData.from_branch_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange("from_branch_id", newValue?._id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      error={fieldErrors.from_branch_id}
                      helperText={
                        fieldErrors.from_branch_id && "From branch is required"
                      }
                      variant="outlined"
                      label=""
                      style={{
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            style={{ height: 45, width: "50%" }}
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Update Parcel
          </Button>
          <Button
            style={{ height: 45, width: "45%", marginLeft: 10 }}
            variant="contained"
            color="secondary"
            onClick={handleSubmit} // Implement handleDeliver function
            disabled={!isDeliverEnabled}
          >
            Deliver
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UpdateParcel;
