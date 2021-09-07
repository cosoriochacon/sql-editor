import React from "react";
import { Link } from "react-router-dom";
import "../styles/Error.css";
import supermanImage from "../../images/superman-blue.png";

const Error = () => {
  return (
    <div className="Error">
      <div className="container">
        <div className="row">
          <div className="Error__col col-12 col-md-4">
            <h1>404</h1>
            <p className="text-36 subheading mb-3">that's an error!</p>
            <p className="mb-5  text-muted text-18">
              Sorry! The page you were looking for doesn't exist.
            </p>
            <Link className="btn btn-primary" to="/">
              Go back to home
            </Link>
          </div>
          <div className="Error__col d-none d-md-block col-md-8">
            <img src={supermanImage} alt="Superman" className="img-fluid p-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
