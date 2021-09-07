import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../../../images/superman.png";

const LayoutNav = () => {
  return (
    <div className="Navbar">
      <div className="container-fluid">
        <Link
          className="Navbar__brand"
          to="/"
          style={{ textDecoration: "none" }}
        >
          <img className="Navbar__brand-logo" src={logo} alt="Logo" />
          <span className="font-weight-light">SQL</span>
          <span className="Navbar__font-yellow">Editor</span>
        </Link>
      </div>
    </div>
  );
};

export default LayoutNav;
