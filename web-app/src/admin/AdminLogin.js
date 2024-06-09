import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";

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
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  margin: 0 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
  width: 100%;
`;

const StyledTypography = styled(Typography)`
  margin-top: 16px;
  text-align: center;
`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/admin/login", { email, password });
      const { token } = response.data;
      if (token) {
        login(token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
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
              Admin Login
            </Typography>
            <StyledTextField
              label="Email"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={email}
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
            {error && (
              <StyledTypography color="error">{error}</StyledTypography>
            )}
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Login
            </StyledButton>
            <br />
            <StyledTypography variant="body1">
              <a href="/staff/login">Login as Staff</a>
            </StyledTypography>
          </LoginForm>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminLogin;
