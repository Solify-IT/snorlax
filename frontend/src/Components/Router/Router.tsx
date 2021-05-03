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
  MODIFY_BOOK,
} from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const UpdateFormView = React.lazy(() => import('src/views/Books.UpdateForm'));
const LocalBooksListView = React.lazy(() => import('src/views/Inventory.LocalBooksList'));
const LibrariesListView = React.lazy(() => import('src/views/Libraries.ListView'));
const ListUsers = React.lazy(() => import('src/views/Users.List'));
const RegisterUser = React.lazy(() => import('src/views/Users.CreateForm'));

const Router: React.FC = () => (
  <PageHeader>
    <Switch>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route exact path={NEW_BOOK} component={RegisterFormView} />
        <Route exact path={LIBRARIES} component={LibrariesListView} />
        <Route exact path={LIST_LOCAL_BOOKS} component={LocalBooksListView} />
        <Route exact path={NEW_USER} component={RegisterUser} />
        <Route exact path={LIST_USERS} component={ListUsers} />
        <Route exact path={MODIFY_BOOK} component={UpdateFormView} />
        <Route exact path={HOME} />
      </React.Suspense>
    </Switch>
  </PageHeader>
);

export default Router;
