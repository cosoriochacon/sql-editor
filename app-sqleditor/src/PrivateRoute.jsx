import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./services/authService";

/**
 * Mostrar el componente solo cuando el usuario esté autenticado
 * de lo contrario, se redirige a login de la aplicación
 * @param {*} childres
 * @returns true or false
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        AuthService.isLogin() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/session/signin" />
        )
      }
    />
  );
};

export default PrivateRoute;
