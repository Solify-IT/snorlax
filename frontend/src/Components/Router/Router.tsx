import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../Loader';
import PageHeader from '../PageHeader';
import HOME, {
  NEW_BOOK,
  LIST_LOCAL_BOOKS,
  LIBRARIES,
  NEW_USER,
  LIST_USERS,
  BOOK_DETAIL,
} from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const FormViewBook = React.lazy(() => import('src/views/Books.FormViewBook'));
const LocalBooksListView = React.lazy(() => import('src/views/Inventory.LocalBooksList'));
const LibrariesListView = React.lazy(() => import('src/views/Libraries.ListView'));
const ListUsers = React.lazy(() => import('src/views/Users.List'));
const RegisterUser = React.lazy(() => import('src/views/Users.CreateForm'));

const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route exact path={NEW_BOOK} component={RegisterFormView} />
        <Route exact path={LIBRARIES} component={LibrariesListView} />
        <Route exact path={LIST_LOCAL_BOOKS} component={LocalBooksListView} />
        <Route exact path={NEW_USER} component={RegisterUser} />
        <Route exact path={LIST_USERS} component={ListUsers} />
        <Route exact path={BOOK_DETAIL} component={FormViewBook} />
      </React.Suspense>
      <Route path={HOME} />
    </PageHeader>
  </Switch>
);

export default Router;
