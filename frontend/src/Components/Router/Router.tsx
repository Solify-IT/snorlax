import React from 'react';
import { Route, Switch } from 'react-router-dom';
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
} from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const SignInView = React.lazy(() => import('src/views/Users.SignIn'));
const SearchLocalBooksView = React.lazy(() => import('src/views/Search.LocalBooksList'));
const LibrariesListView = React.lazy(() => import('src/views/Libraries.ListView'));
const ListUsers = React.lazy(() => import('src/views/Users.List'));
const RegisterUser = React.lazy(() => import('src/views/Users.CreateForm'));

const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <Route exact path={HOME} />
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route exact path={SIGN_IN}>
          <SignInView />
        </Route>
        <PrivateRoute exact path={NEW_BOOK}>
          <RegisterFormView />
        </PrivateRoute>
        <PrivateRoute exact path={LIST_LOCAL_BOOKS}>
          <SearchLocalBooksView />
        </PrivateRoute>
        <PrivateRoute exact path={LIBRARIES}>
          <LibrariesListView />
        </PrivateRoute>
        <PrivateRoute exact path={NEW_USER}>
          <RegisterUser />
        </PrivateRoute>
        <PrivateRoute exact path={LIST_USERS}>
          <ListUsers />
        </PrivateRoute>
      </React.Suspense>
    </PageHeader>
  </Switch>
);

export default Router;
