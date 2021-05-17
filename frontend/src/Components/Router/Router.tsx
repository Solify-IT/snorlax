import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../Loader';
import PageHeader from '../PageHeader';
import HOME, {
  NEW_BOOK,
  LIBRARIES,
  NEW_USER,
  LIST_USERS,
  LIST_LOCAL_BOOKS,
  UPDATE_USER,
} from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const SearchLocalBooksView = React.lazy(() => import('src/views/Search.LocalBooksList'));
const LibrariesListView = React.lazy(() => import('src/views/Libraries.ListView'));
const ListUsers = React.lazy(() => import('src/views/Users.List'));
const RegisterUser = React.lazy(() => import('src/views/Users.CreateForm'));
const UpdateUser = React.lazy(() => import('src/views/Users.Update'));
const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <Route exact path={HOME} />
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route exact path={NEW_BOOK} component={RegisterFormView} />
        <Route exact path={LIST_LOCAL_BOOKS} component={SearchLocalBooksView} />
        <Route exact path={LIBRARIES} component={LibrariesListView} />
        <Route exact path={NEW_USER} component={RegisterUser} />
        <Route exact path={LIST_USERS} component={ListUsers} />
        <Route exact path={UPDATE_USER} component={UpdateUser} />
      </React.Suspense>
    </PageHeader>
  </Switch>
);

export default Router;
