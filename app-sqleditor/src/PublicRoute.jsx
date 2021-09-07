import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./services/authService";

/**
 * Mostrar las pantallas publicas de la aplicación
 * @param {*} childrens
 * @returns
 */
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        AuthService.isLogin() && restricted ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
