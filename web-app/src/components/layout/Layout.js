import React from "react";
import { Box, Container } from "@mui/material";
import Header from "../header/Header";

const Layout = ({ children }) => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flexGrow: 1, marginTop: 4 }}>
        <Container maxWidth="lg">
          <main>{children}</main>
        </Container>
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;
