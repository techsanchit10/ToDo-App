import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Common from "./../utils/Common";

const ProtecteRoute = (props) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <>
          {rest.authenticate ? (
            Common.isAuthenticated() ? (
              <Component {...matchProps} />
            ) : (
              <Redirect to="/login" />
            )
          ) : (
            <Component {...matchProps} />
          )}
        </>
      )}
    />
  );
};

ProtecteRoute.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string,
};

export default ProtecteRoute;
