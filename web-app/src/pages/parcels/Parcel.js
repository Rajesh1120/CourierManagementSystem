import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import ParcelDetails from "./ParcelDetails";
import { useAuth } from "../../contexts/AuthContext";

const ParcelPage = () => {
  const { id, parcelId } = useParams();
  const [parcel, setParcel] = useState(null);
  const { isAdmin } = useAuth();
  const parcelIdVal = isAdmin() ? parcelId : id;
  useEffect(() => {
    async function fetchParcelDetails() {
      try {
        const response = await api.get(`/parcels/${parcelIdVal}`);
        setParcel(response.data);
      } catch (error) {
        console.error("Failed to fetch parcel details:", error);
      }
    }

    fetchParcelDetails();
  }, [id]);

  if (!parcel) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return <ParcelDetails parcel={parcel} />;
};

export default ParcelPage;
