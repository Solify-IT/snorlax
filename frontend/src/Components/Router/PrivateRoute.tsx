import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import useAuth from 'src/hooks/auth';
import { SIGN_IN } from './routes';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { idToken } = useAuth();

  return (
    <Route
      {...rest}
      render={() => (idToken
        ? children
        : <Redirect to={SIGN_IN} />
      )}
    />
  );
};

export default PrivateRoute;
