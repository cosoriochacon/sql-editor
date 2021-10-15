import React from "react";
import { Link } from "react-router-dom";

import "../styles/Home.css";
import databaseImage from "../../images/db.png";

const Home = () => {
  return (
    <div className="Home">
      <div className="container">
        <div className="row">
          <div className="Home__col col-12 col-md-4">
            <h1>
              Welcome to the management system SQL
              <b className="font-yellow">Editor</b>
            </h1>
            <Link className="btn btn-primary" to="/editor">
              Get Started
            </Link>
          </div>

          <div className="Home__col d-none d-md-block col-md-8">
            <img src={databaseImage} alt="Superman" className="img-fluid p-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
