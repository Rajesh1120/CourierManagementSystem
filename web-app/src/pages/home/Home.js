import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ParcelDetails from "../parcels/ParcelDetails";
import api from "../../api/api";
import {toast} from 'react-hot-toast'

const Home = () => {
  const [parcelId, setParcelId] = useState("");
  const [parcel, setParcel] = useState(null);

  const fetchParcelDetails = async () => {
    try {
      const response = await api.get(`/parcels/${parcelId}`);
      setParcel(response.data);
    } catch (error) {
      console.error("Failed to fetch parcel details:", error);
      toast.success("Succesfully Staff is Created ")
    }
    
  };

  const handleParcelIdChange = (event) => {
    setParcelId(event.target.value);
  };

  return (
    <Container>
      <Box
        sx={{
          display: "grid",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 4,
        }}
      >
        <Box>
          <Typography variant="h2" gutterBottom>
            Welcome to the Parcel Management System
          </Typography>
          <Typography variant="body1" gutterBottom>
            Efficiently manage and track parcels with our comprehensive Parcel
            Management System. Simplify your logistics operations and enhance
            customer satisfaction.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Streamline Parcel Handling and Delivery
        </Typography>
        <Typography variant="body1" gutterBottom>
          Our Parcel Management System offers a complete solution for booking,
          tracking, and delivering parcels. Whether it's across town or across
          the country, our platform ensures efficient and secure parcel
          management.
        </Typography>
        <Typography variant="body1" gutterBottom>
          From booking a parcel to real-time tracking, our user-friendly
          interface simplifies the entire process. Staff members can schedule
          pickups, track parcels in transit, and manage delivery operations with
          ease.
        </Typography>
        <br />
        <TextField
          label="Enter Parcel ID"
          variant="outlined"
          size="small"
          value={parcelId}
          onChange={handleParcelIdChange}
        />
        <Button
          variant="contained"
          onClick={fetchParcelDetails}
          style={{ marginLeft: "10px" }}
        >
          Get Parcel Details
        </Button>
        {parcel && (
          <div>
            <ParcelDetails parcel={parcel} />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default Home;
