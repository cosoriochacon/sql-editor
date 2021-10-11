import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/home/Home";
import Layout from "./components/views/layout/Layout";
import Error from "./components/sessions/Error";
import Signin from "./components/sessions/Signin";
import EditorWizard from "./components/editor/EditorWizard";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import EditorRemoteWizard from "./components/editor-remote/EditorRemoteWizard";

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
          <PrivateRoute component={EditorWizard} path="/editor" exact />
          <PrivateRoute component={EditorRemoteWizard} path="/remote" exact />
          <Route component={Error}></Route>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
