import React, { useMemo } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import useAuth, { AuthUserType } from 'src/hooks/auth';
import { SIGN_IN } from './routes';

export interface Props {
  hasAccess?(user: AuthUserType): boolean;
}

const PrivateRoute: React.FC<RouteProps & Props> = ({
  children, hasAccess, ...rest
}) => {
  const { idToken, user } = useAuth();

  const userHasAccess: boolean = useMemo(() => {
    if (!user) return false;

    return hasAccess ? hasAccess(user) : true;
  }, [user, hasAccess]);

  console.log(idToken, user, userHasAccess);
  return (
    <Route
      {...rest}
      render={() => (idToken && user && userHasAccess
        ? children
        : <Redirect to={SIGN_IN} />
      )}
    />
  );
};

export default PrivateRoute;
