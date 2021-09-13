import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../../../images/superman.png";
import AuthService from "../../../services/authService";

const user = AuthService.getCurrentUser();
const LayoutNav = () => {
  const handleClick = async () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <div className="Navbar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
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
          <div className="col-10"></div>
          <div className="col-1">
            {user && (
              <>
                {Object.keys(user).length > 0 && (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleClick}
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutNav;
