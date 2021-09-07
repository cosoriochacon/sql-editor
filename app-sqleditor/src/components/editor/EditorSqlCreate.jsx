import React, { useState, useEffect, useReducer } from "react";
import Https from "../../libs/Https";
import { Formik } from "formik";
import * as yup from "yup";
import swal from "sweetalert2";

const initialState = {
  querys: [],
};

const queryReducer = (state, action) => {
  switch (action.type) {
    case "ADD_QUERY":
      return {
        ...state,
        querys: [...state.querys, action.payload],
      };
    case "REMOVE_QUERY":
      return {
        ...state,
        querys: [],
      };
    default:
      return state;
  }
};

const EditorSqlCreate = () => {
  const [database, setDatabase] = useState([]);
  const [selectedDB, setSelectedDB] = useState(null);
  const [idDB, setIdDB] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [querys, dispatch] = useReducer(queryReducer, initialState);
  const [isreload, setIsReload] = useState(false);

  const getDatabases = async () => {
    const res = await Https.get("database");
    setDatabase(res.data);
  };

  const handleCheck = async (values) => {
    setSelectedDB(values.nombreDB);
    setIdDB(values.iddatabase);
    setIsDisabled(!isDisabled);
  };

  const handleSubmit = (query, { setSubmitting }) => {
    if (selectedDB === null) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        confirmButtonColor: "#249B83",
        text: "Not selected to schema",
      });
      setSubmitting(false);
    } else {
      dispatch({ type: "ADD_QUERY", payload: query.query });
      setSubmitting(true);
    }
  };

  const handleSaveFile = async () => {
    setIsReload(true);
    const regex = /create table/i;
    let query = querys.querys[0];
    let query2 = query.split("(");
    let query3 = query2[1].split(")");
    let query4 = query3[0].split(",");
    let fields = query4.toString();
    let t1 = query.replace(regex, "");
    let t2 = t1.split("(");
    let table = t2[0].trim();
    let body2 = {
      iddb: idDB,
      query: query,
      cant: query4.length,
      fields: fields,
      table: table,
    };
    let body = { namedb: table, text: "" };
    const res = await Https.post("file", body);
    if (res.status === 1) {
      dispatch({ type: "REMOVE_QUERY", payload: "" });
      setSelectedDB(null);
      setIsDisabled(false);
      await saveQuery(body2);
    }
  };

  const saveQuery = async (body) => {
    const res = await Https.post("query", body);
    if (res.status === 1) {
      setIsReload(false);
      swal.fire({
        icon: "success",
        title: "Successfully",
        confirmButtonColor: "#249B83",
        text: res.msg,
      });
    } else if (res.status === 0) {
      setIsReload(false);
      swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#249B83",
        text: res.msg,
      });
    }
  };

  useEffect(() => {
    getDatabases();
  }, []);

  return (
    <div className="container" style={{ margin: "10px" }}>
      {isreload === false ? (
        <>
          <div className="row">
            <div className="col-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Databases</h5>
                  {database.length > 0 ? (
                    <>
                      {database.map((item) => (
                        <div key={item.iddatabase}>
                          <div className="list-group list-group-numbered">
                            <div className="list-group-item d-flex justify-content-between align-items-start">
                              <div className="ms-2 me-auto">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    onClick={() => handleCheck(item)}
                                    value={item.nombreDB}
                                    disabled={isDisabled}
                                  />
                                  <p className="text-muted">{item.nombreDB}</p>
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
            <div className="col-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Editor</h5>
                  <Formik
                    initialValues={{ query: "" }}
                    validationSchema={editorSchema}
                    onSubmit={handleSubmit}
                  >
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
                          placeholder="Query"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          defaultValue={"create table"}
                        ></textarea>
                        <div className="text-danger">
                          {errors.query && touched.query && errors.query}
                        </div>
                        <br />
                        <div className="d-flex justify-content-end">
                          <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isSubmitting}
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Results</h5>
                  {querys.querys.length > 0 ? (
                    <>
                      {querys.querys.map((item, ind) => (
                        <div key={ind}>
                          <li>{item}</li>
                        </div>
                      ))}
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleSaveFile}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted">Not results to show</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="spinner-border text-primary" role="status"></div>
      )}
    </div>
  );
};

const editorSchema = yup.object().shape({
  query: yup
    .string()
    .required("Required")
    .matches(
      /^create table \w+ [(][[\w\W].*[)];$/,
      "Not match: create table table_name (params);"
    ),
});

export default EditorSqlCreate;
