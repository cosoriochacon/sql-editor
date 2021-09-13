import React from "react";
import { Spinner } from "react-bootstrap";

const styles = {
  position: "fixed",
  left: 0,
  right: 0,
  top: "calc(50% - 20px)",
  margin: "auto",
  height: "40px",
  width: "40px",
  zIndex: 324324324,
};

const Loading = () => {
  return (
    <div style={styles}>
      <div className="spinner spinner-bubble spinner-bubble-primary"></div>
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
