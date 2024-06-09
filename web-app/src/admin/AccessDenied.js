import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "2rem" }}>Access Denied</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Sorry, you do not have access to this page.
      </p>
      <Link
        to="/"
        style={{ fontSize: "1.2rem", color: "#0077ff", textDecoration: "none" }}
      >
        Go to Home page
      </Link>
    </div>
  );
};

export default AccessDenied;
