import { Typography } from 'antd';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import useAuth from 'src/hooks/auth';
import { isAdmin } from 'src/utils/auth';
import Loader from '../Loader';
import PageHeader from '../PageHeader';
import PrivateRoute from './PrivateRoute';
import HOME, {
  NEW_BOOK,
  SIGN_IN,
  LIST_LOCAL_BOOKS,
  LIBRARIES,
  NEW_USER,
  LIST_USERS,
  UPDATE_USER,
  BOOK_DETAIL,
  INVENTORY,
  NEW_LIBRARY,
} from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const SignInView = React.lazy(() => import('src/views/Users.SignIn'));
const SearchLocalBooksView = React.lazy(() => import('src/views/Search.LocalBooksList'));
const LibrariesListView = React.lazy(() => import('src/views/Libraries.ListView'));
const ListUsers = React.lazy(() => import('src/views/Users.List'));
const RegisterUser = React.lazy(() => import('src/views/Users.CreateForm'));
const RegisterLibrary = React.lazy(() => import('src/views/Library.CreateLibrary'));
const UpdateUser = React.lazy(() => import('src/views/Users.Update'));
const DetailViewBook = React.lazy(() => import('src/views/Books.FormViewBook'));

const Router: React.FC = () => {
  const { user: currUser, getHomeForRole } = useAuth();

  return (
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Switch>
          <Route exact path={HOME}>
            {currUser
              ? <Redirect to={getHomeForRole(currUser.role.name)} />
              : <Redirect to={SIGN_IN} />}
          </Route>
          <Route exact path={SIGN_IN}>
            <SignInView />
          </Route>
          <PrivateRoute
            exact
            path={NEW_BOOK}
          >
            <RegisterFormView />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={[LIST_LOCAL_BOOKS, INVENTORY]}
          >
            <SearchLocalBooksView />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={LIBRARIES}
            hasAccess={(user) => isAdmin(user)}
          >
            <LibrariesListView />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={NEW_USER}
            hasAccess={(user) => isAdmin(user)}
          >
            <RegisterUser />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={NEW_LIBRARY}
            hasAccess={(user) => isAdmin(user)}
          >
            <RegisterLibrary />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={LIST_USERS}
            hasAccess={(user) => isAdmin(user)}
          >
            <ListUsers />
          </PrivateRoute>
          <PrivateRoute
            path={BOOK_DETAIL}
          >
            <DetailViewBook />
          </PrivateRoute>

          <PrivateRoute
            exact
            path={UPDATE_USER}
            hasAccess={(user) => isAdmin(user)}
          >
            <UpdateUser />
          </PrivateRoute>
          <Route>
            {currUser
              ? <Typography.Title>¡No se encontró la página que estabas buscando!</Typography.Title>
              : <Redirect to={SIGN_IN} />}
          </Route>
        </Switch>
      </React.Suspense>
    </PageHeader>
  );
};

export default Router;
