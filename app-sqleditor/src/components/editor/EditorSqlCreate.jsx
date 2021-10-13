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
  const [isDisabled, setIsDisabled] = useState(false);
  const [querys, dispatch] = useReducer(queryReducer, initialState);
  const [isSubmit, setSubmit] = useState(false);

  const handleSubmit = (query) => {
    dispatch({ type: "ADD_QUERY", payload: query.query });
    setSubmit(true);
    setIsDisabled(!isDisabled);
  };

  const handleSaveFile = async () => {
    let query = querys.querys[0];

    let body = { query: query };
    const res = await Https.post("query/create", body);
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

  return (
    <div className="container" style={{ margin: "10px" }}>
      <div className="row">
        <div className="col-12">
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
                      placeholder="create table table_name (params);"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isDisabled}
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
      /^create table \w+ [(][[\w\W].*[)];$/,
      "Not match: create table table_name (params);"
    ),
});

export default EditorSqlCreate;
