import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/home/Home";
import Layout from "./components/views/layout/Layout";
import Error from "./components/sessions/Error";
import Signin from "./components/sessions/Signin";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Editor from "./components/editor/Editor";
import "moment/locale/es";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <PublicRoute
            restricted={true}
            component={Signin}
            path="/session/signin"
            exact
          />
          <PrivateRoute component={Home} path="/" exact />
          <PrivateRoute component={Editor} path="/editor" exact />
          <Route component={Error}></Route>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
