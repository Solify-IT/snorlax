import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../Loader';
import PageHeader from '../PageHeader';
import HOME, {
  NEW_BOOK,
  LIST_LOCAL_BOOKS,
  SEARCH_LOCAL_BOOKS,
  LIBRARIES,
  NEW_USER,
  LIST_USERS,
} from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const LocalBooksListView = React.lazy(() => import('src/views/Inventory.LocalBooksList'));
const LibrariesListView = React.lazy(() => import('src/views/Libraries.ListView'));
const ListUsers = React.lazy(() => import('src/views/Users.List'));
const RegisterUser = React.lazy(() => import('src/views/Users.CreateForm'));

const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <Route exact path={HOME} />
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route exact path={NEW_BOOK} component={RegisterFormView} />
        <Route exact path={SEARCH_LOCAL_BOOKS} component={SearchBooksListView} />
        <Route exact path={LIBRARIES} component={LibrariesListView} />
        <Route exact path={LIST_LOCAL_BOOKS} component={LocalBooksListView} />
        <Route exact path={NEW_USER} component={RegisterUser} />
        <Route exact path={LIST_USERS} component={ListUsers} />
      </React.Suspense>
    </PageHeader>
  </Switch>
);

export default Router;
