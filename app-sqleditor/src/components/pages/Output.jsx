import React from "react";
import { BsCheckLg, BsXLg } from "react-icons/bs";

const Output = (props) => {
  return (
    <div className="overflow-auto" style={{ height: "400px" }}>
      {props.logs.length > 0 ? (
        <ol className="list-group list-group-numbered">
          {props.logs.map((item, ind) => (
            <li
              key={ind}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{item.date}</div>
                {item.message}
              </div>
              {item.status === 0 ? (
                <span className="badge bg-success rounded-pill">
                  <BsCheckLg></BsCheckLg>
                </span>
              ) : (
                <span className="badge bg-danger rounded-pill">
                  <BsXLg></BsXLg>
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted">Not outputs</p>
      )}
    </div>
  );
};

export default Output;
