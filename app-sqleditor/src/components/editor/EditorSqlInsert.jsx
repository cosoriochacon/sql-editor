import React, { useState, useEffect, useReducer } from "react";
import { Accordion, Card } from "react-bootstrap";
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

const EditorSqlInsert = () => {
  const [database, setDatabase] = useState([]);
  const [idquery, setIdQuery] = useState(null);
  const [nameTable, setNameTable] = useState(null);
  const [selectedDB, setSelectedDB] = useState(null);
  const [idDB, setIdDB] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isCheck, setIsCheck] = useState(true);
  const [defaultValue, setDefaultValue] = useState(null);
  const [querys, dispatch] = useReducer(queryReducer, initialState);
  const [isreload, setIsReload] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const getDatabases = async () => {
    const res = await Https.get("database/querys");
    console.log(res.data);
    setDatabase(res.data);
  };

  const handleCheck = async (item) => {
    setIsCheck(false);
    let def = "insert into" + " " + item.nombreDB + "." + item.tableName;
    setIsDisabled(!isDisabled);
    setNameTable(item.tableName);
    setDefaultValue(def);
    setIdQuery(idquery);
    setSelectedDB(item.nombreDB);
    setIdDB(item.iddatabase);
  };

  const handleSubmit = (query) => {
    if (selectedDB === null) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        confirmButtonColor: "#249B83",
        text: "Not selected to schema",
      });
      setIsSubmit(false);
    } else {
      dispatch({ type: "ADD_QUERY", payload: query.query });
      setIsSubmit(true);
    }
  };

  const handleSaveFile = async () => {
    let query = querys.querys[0];
    let arr_query = query.split(" ");
    let cols = arr_query[3];
    let c1 = cols.replace("(", "");
    let c2 = c1.replace(")", "");
    let arr_cols = c2.split(",");
    let vals = arr_query[5];
    let v1 = vals.replace("(", "");
    let v2 = v1.replace(");", "");
    let arr_vals = v2.split(",");

    if (arr_cols.length === arr_vals.length) {
      let body = { namedb: nameTable, text: v2 };
      const res = await Https.post("file", body);
      if (res.status === 1) {
        setIsReload(true);
        setDefaultValue(null);
        dispatch({ type: "REMOVE_QUERY", payload: "" });
        setSelectedDB(null);
        setIsReload(false);
        setIsDisabled(false);
        setIsCheck(true);
        setIsSubmit(false);
        swal.fire({
          icon: "success",
          title: "Successfully",
          confirmButtonColor: "#249B83",
          text: "Query inserted successfully",
        });
        // await saveQuery();
      }
    } else {
      setIsSubmit(false);
      swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#249B83",
        text: "The length of the columns does not match the length of the values",
      });
      dispatch({ type: "REMOVE_QUERY", payload: "" });
    }
  };

  //   const saveQuery = async () => {
  //     console.log("saveQuery");
  //   };

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
                      {database.map((item, ind) => (
                        <Card key={ind} className="mb-3 shadow-sm">
                          <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey={ind}>
                              <Accordion.Header>{item[0]}</Accordion.Header>
                              <Accordion.Body>
                                {item[1].map((item, id) => (
                                  <div key={id}>
                                    <div className="row">
                                      <div className="col-10">
                                        <p>{item.tableName}</p>
                                      </div>
                                      <div className="col-2">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="flexRadioDefault"
                                          onClick={() => handleCheck(item)}
                                          value={item.tableName}
                                          disabled={isDisabled}
                                        />
                                      </div>
                                    </div>
                                    <hr></hr>
                                  </div>
                                ))}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Card>
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
      /^insert into \w+[.]\w+ [(][[\w\W].*[)] values [(][[\w\W].*[)];$/,
      "Not match: insert into db.table_name (params) values (values);"
    ),
});

export default EditorSqlInsert;
