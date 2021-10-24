import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Auth from "../Container/Auth";
import ProjectsDashboard from "../Container/ProjectsDashboard";


const Routes = () => {
  return (
    <Switch>
      <ProtectedRoute
        exact
        component={ProjectsDashboard}
        path="/"
        authenticate={true}
      />
      <ProtectedRoute
        exact
        component={Auth}
        path="/login"
        authenticate={false}
      />
      <ProtectedRoute
        exact
        component={Auth}
        path="/signup"
        authenticate={false}
      />
      <Redirect exact from="/" to="/" authenticate={false} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
