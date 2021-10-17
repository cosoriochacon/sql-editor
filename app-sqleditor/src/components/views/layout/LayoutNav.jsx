import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../../../images/db2.png";
import AuthService from "../../../services/authService";

const user = AuthService.getCurrentUser();
const LayoutNav = () => {
  const handleClick = async () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg Navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img className="Navbar__brand-logo" src={logo} alt="Logo" />
            <span className="Navbar__font-white">SQL</span>
            <span className="Navbar__font-yellow">Editor</span>
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                {user && (
                  <>
                    {Object.keys(user).length > 0 && (
                      <Link className="nav-link" to="/dbms">
                        <span className="Navbar__font_li">Editor</span>
                      </Link>
                    )}
                  </>
                )}
              </li>
            </ul>
          </div>
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
      </nav>
    </div>
  );
};

export default LayoutNav;
