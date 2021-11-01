import React, { useEffect, useState } from "react";
import Https from "../../libs/Https";
import { Formik } from "formik";
import swal from "sweetalert2";
import sqliteParser from "sqlite-parser";

import moment from "moment";

import Wizard from "../pages/Wizard";

const Editor = () => {
  const [logs, setLogs] = useState([]);
  const [table, setTable] = useState({});

  const queryParser = async (query) => {
    try {
      const ast = sqliteParser(query);
      let sts = ast.statement[0];
      if (sts.variant === "create") {
        return sts.name.name.split(".")[0].trim();
      } else if (sts.variant === "insert" || sts.variant === "update") {
        return sts.into.name.split(".")[0].trim();
      } else if (sts.variant === "delete" || sts.variant === "select") {
        return sts.from.name.split(".")[0].trim();
      } else if (sts.variant === "drop") {
        return sts.target.name.split(".")[0].trim();
      }
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = async (query) => {
    console.log(moment().format("LLL"));
    let db = await queryParser(query.query);
    db = db.toUpperCase();
    let url;
    if (db === "VM") {
      url = process.env.REACT_APP_URL_SERVER_VICTOR;
    } else if (db === "WS") {
      url = process.env.REACT_APP_URL_SERVER_WALTER;
    } else if (db === "MP") {
      url = process.env.REACT_APP_URL_SERVER_MIGUEL;
    } else if (db === "CO") {
      url = process.env.REACT_APP_URL_SERVER_LOCAL;
    } else {
      swal.fire({
        icon: "error",
        title: "Error!",
        confirmButtonColor: "#249B83",
        text: "Server does not exist",
        timer: 2500,
      });
      let res = { status: 1, message: `Server does ${db} not exist` };
      await addLog(res);
      return;
    }

    if (url != undefined) {
      const res = await Https.postRemote(url + "/parseQuery", query);
      await addLog(res);
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

  const addLog = async (body) => {
    await Https.post("logs", body);
  };

  useEffect(() => {
    getLogs();
    setTable({});
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <div className="row">
        <div className="col-7">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Editor</h5>
              <Formik initialValues={{ query: "" }} onSubmit={handleSubmit}>
                {({ handleChange, handleBlur, handleSubmit }) => (
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
        <div className="col-5">
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
