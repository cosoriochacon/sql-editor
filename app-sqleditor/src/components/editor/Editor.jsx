import React, { useEffect, useState } from "react";
import Https from "../../libs/Https";
import { Formik } from "formik";
import swal from "sweetalert2";

import Wizard from "../pages/Wizard";

const Editor = () => {
  const [servers, setServers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [schema, setSchema] = useState(null);
  const [table, setTable] = useState({});

  const getServers = async () => {
    const res = await Https.get("schemas");
    setServers(res);
  };

  const handleCheck = async (values) => {
    setSchema(values.key);
  };

  const handleSubmit = async (query) => {
    if (schema == null) {
      swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "You have not selected the server",
        confirmButtonColor: "#249B83",
      });
    } else {
      let url;
      if (schema === "VM") {
        url = process.env.REACT_APP_URL_SERVER_VICTOR;
      } else if (schema === "WS") {
        url = process.env.REACT_APP_URL_SERVER_WALTER;
      } else if (schema === "MP") {
        url = process.env.REACT_APP_URL_SERVER_MIGUEL;
      } else if (schema === "CO") {
        url = process.env.REACT_APP_URL_SERVER_LOCAL;
      }
      const res = await Https.postRemote(url + "/parseQuery", query);
      console.log(res);
      setTable(res.table);
      if (res.status === 1) {
        swal.fire({
          icon: "warning",
          title: "Oops!",
          text: res.message,
          confirmButtonColor: "#249B83",
        });
      } else if (res.status === 0) {
        swal.fire({
          icon: "success",
          title: "Successfully",
          confirmButtonColor: "#249B83",
          text: res.message,
        });
      } else {
        swal.fire({
          icon: "error",
          title: "Error!",
          confirmButtonColor: "#249B83",
          text: res.message,
          timer: 2500,
        });
      }
      await getLogs();
    }
  };

  const getLogs = async () => {
    const res = await Https.get("logs");
    setLogs(res);
  };

  useEffect(() => {
    getServers();
    getLogs();
    setTable({});
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <div className="row">
        <div className="col-3">
          <div className="card" style={{ backgroundColor: "#F2F3F4" }}>
            <div className="card-body">
              <h5 className="card-title">Servers</h5>
              {servers.length > 0 ? (
                <>
                  {servers.map((item, ind) => (
                    <div key={ind}>
                      <div className="list-group list-group-numbered">
                        <div className="list-group-item d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                onClick={() => handleCheck(item)}
                              />
                              <p className="text-muted">{item.value}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-muted">Not results</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="card">
            <div className="card-body">
              <Formik initialValues={{ query: "" }} onSubmit={handleSubmit}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="form-control"
                      name="query"
                      id="query"
                      rows="5"
                      placeholder="Write your query"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    <br />
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary">
                        EXECUTE QUERY
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <Wizard logs={logs} table={table}></Wizard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
