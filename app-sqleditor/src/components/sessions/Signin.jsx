import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import swal from "sweetalert2";
import authService from "../../services/authService";

import "../styles/Signin.css";
import supermanImage from "../../images/superman.png";

import Loading from "../views/Loading";

const Signin = (props) => {
  const handleSubmit = async (values) => {
    const res = await authService.login(values.username, values.password);
    if (res.status === 1) {
      localStorage.setItem("auth_user", JSON.stringify(res.data));
      props.history.push("/");
      swal
        .fire({
          icon: "success",
          title: "Welcome",
          confirmButtonColor: "#249B83",
          text: res.msg,
        })
        .then((result) => {
          window.location.reload();
        });
    } else if (res.status === 0) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        confirmButtonColor: "#249B83",
        text: res.msg,
      });
    }
  };

  return (
    <div className="Signin">
      <div className="container">
        <div className="row">
          <div className="Signin__col col-12 col-md-6">
            <div className="Badge">
              <div className="Badge__header">
                <h3>Login</h3>
              </div>

              <div className="Badge__section-name">
                <div className="mb-3">
                  <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={signinSchema}
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
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.username}
                        />
                        <div className="text-danger">
                          {errors.username &&
                            touched.username &&
                            errors.username}
                        </div>
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                        <div className="text-danger">
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </div>
                        <br />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-success"
                        >
                          Sign In
                        </button>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>

          <div className="Signin__col d-none d-md-block col-md-6">
            <img src={supermanImage} alt="Superman" className="img-fluid p-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const signinSchema = yup.object().shape({
  username: yup.string().required("es requerido"),
  password: yup.string().required("es requerido"),
});

export default Signin;
