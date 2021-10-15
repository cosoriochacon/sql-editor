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

const EditorCreate = () => {
  const [servers, setServers] = useState([]);
  const [isCheck, setIsCheck] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);
  const [schema, setSchema] = useState(null);
  const [isSubmit, setSubmit] = useState(false);
  const [querys, dispatch] = useReducer(queryReducer, initialState);

  const getServers = async () => {
    const res = await Https.get("schemas");
    setServers(res);
  };

  const handleCheck = async (values) => {
    setIsCheck(false);
    let def = `create table ${values.key}.`;
    setSchema(values.key);
    setDefaultValue(def);
    setIsDisabled(!isDisabled);
  };

  const handleSubmit = (query) => {
    dispatch({ type: "ADD_QUERY", payload: query.query });
    setSubmit(true);
  };

  const handleSaveFile = async () => {
    let query = querys.querys[0];
    let body = { query: query };
    let url;
    if (schema === "VA") {
      url = process.env.REACT_APP_URL_SERVER_VICTOR;
    } else if (schema === "WS") {
      url = process.env.REACT_APP_URL_SERVER_WALTER;
    } else if (schema === "MP") {
      url = process.env.REACT_APP_URL_SERVER_MIGUEL;
    } else if (schema === "CO") {
      url = process.env.REACT_APP_URL_SERVER_LOCAL;
    }
    const res = await Https.postRemote(url + "/parseQuery", body);
    if (res.status === 1) {
      swal
        .fire({
          icon: "warning",
          title: "Oops!",
          text: res.message,
          confirmButtonColor: "#249B83",
        })
        .then(() => {
          setIsDisabled(!isDisabled);
          dispatch({ type: "REMOVE_QUERY", payload: "" });
          setSubmit(false);
        });
    } else if (res.status === 0) {
      swal
        .fire({
          icon: "success",
          title: "Successfully",
          confirmButtonColor: "#249B83",
          text: res.message,
        })
        .then(() => window.location.reload());
    }
  };

  useEffect(() => {
    getServers();
  }, []);

  return (
    <div className="container" style={{ margin: "10px" }}>
      <div className="row">
        <div className="col-4">
          <div className="card">
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
                                disabled={isDisabled}
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
                      defaultValue={defaultValue}
                      disabled={isCheck}
                    ></textarea>
                    <div className="text-danger">
                      {errors.query && touched.query && errors.query}
                    </div>
                    <br />
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmit}
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
    </div>
  );
};

const editorSchema = yup.object().shape({
  query: yup
    .string()
    .required("Required")
    .matches(
      /^create table \w+[.]\w+ [(][[\w\W].*[)];$/,
      "Not match: create table server.table_name (params);"
    ),
});

export default EditorCreate;
