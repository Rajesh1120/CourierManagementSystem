import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useHistory
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-left: 20px;
`;

const StyledButton = styled(Button)`
  margin-left: auto;
  margin-right: 20px;
`;

const Header = () => {
  const { isAdmin, isAuthenticated, isStaff, user, logout } = useAuth();
  const isLoggedIn = isAuthenticated();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/logout");
  };

  return (
    <AppBar position="sticky" style={{ top: 0 }}>
      <Toolbar>
        <StyledLink to="/">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Parcel Management System
          </Typography>
        </StyledLink>

        <div style={{ marginLeft: "auto" }}>
          {isAdmin() && isLoggedIn && (
            <>
              <StyledLink to="/admin/dashboard">
                <Button color="inherit">Dashboard</Button>
              </StyledLink>
            </>
          )}
          {isStaff() && isLoggedIn && (
            <>
              <StyledLink to="/staff/dashboard">
                <Button color="inherit">Dashboard</Button>
              </StyledLink>
            </>
          )}
          {!isLoggedIn && (
            <>
              <StyledLink to="/staff/login">
                <Button color="inherit">Login</Button>
              </StyledLink>
            </>
          )}
          {isLoggedIn && (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar>{user?.name.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem>Welcome, {user?.name}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>{" "}
                {/* Use handleLogout */}
              </Menu>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
