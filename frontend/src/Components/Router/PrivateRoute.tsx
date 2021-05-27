import React, { useMemo } from 'react';
import {
  Redirect, Route, RouteProps, useLocation,
} from 'react-router-dom';
import useAuth, { AuthUserType } from 'src/hooks/auth';
import { SIGN_IN } from './routes';

export interface Props {
  hasAccess?(user: AuthUserType): boolean;
}

const PrivateRoute: React.FC<RouteProps & Props> = ({
  children, hasAccess, ...rest
}) => {
  const { idToken, user } = useAuth();
  const { pathname } = useLocation();

  const userHasAccess: boolean = useMemo(() => {
    if (!user) return false;

    return hasAccess ? hasAccess(user) : true;
  }, [user, hasAccess]);

  return (
    <Route
      {...rest}
      render={() => (idToken && user && userHasAccess
        ? children
        : <Redirect to={{ pathname: SIGN_IN, state: { from: pathname } }} />
      )}
    />
  );
};

export default PrivateRoute;
