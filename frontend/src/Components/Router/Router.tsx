import React from 'react';
import { Route, Switch } from 'react-router-dom';
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
const DetailViewBook = React.lazy(() => import('src/views/Books.FormViewBook'));

const Router: React.FC = () => (

  <PageHeader>
    <React.Suspense fallback={<Loader isLoading />}>
      <Switch>
        <Route exact path={HOME} />
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
      </Switch>
    </React.Suspense>
  </PageHeader>

);

export default Router;
