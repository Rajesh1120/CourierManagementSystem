import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast"

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background-color: #fff;
  border-radius: 8px;
  max-width: 400px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 16px;
`;

const StaffLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/staff/login", { email, password }); // Update API endpoint
      const { token } = response.data;
      login(token);
      
      navigate("/staff/dashboard"); // Update dashboard route
      
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <LoginForm>
            <Typography variant="h5" component="h1" gutterBottom>
              Staff Login
            </Typography>
            {error && (
              <StyledTypography color="error">{error}</StyledTypography>
            )}
            <StyledTextField
              label="Email"
              variant="outlined"
              size="small"
              fullWidth
              value={email}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <StyledTextField
              label="Password"
              type="password"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleLogin}
              fullWidth
            >
              Login
            </StyledButton>
            <br />
            <StyledTypography variant="body1">
              <a href="/admin/login">Login as Admin</a>
            </StyledTypography>
          </LoginForm>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default StaffLogin;
