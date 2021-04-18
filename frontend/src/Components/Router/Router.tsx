import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../Loader';
import PageHeader from '../PageHeader';
import HOME, { NEW_BOOK, LIST_LOCAL_BOOKS, SEARCH_LOCAL_BOOKS } from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const LocalBooksListView = React.lazy(() => import('src/views/Inventory.LocalBooksList'));
const SearchBooksListView = React.lazy(() => import('src/views/Search.LocalBooksList'));

const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <Route exact path={HOME} />
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route exact path={NEW_BOOK} component={RegisterFormView} />
        <Route exact path={LIST_LOCAL_BOOKS} component={LocalBooksListView} />
        <Route exact path={SEARCH_LOCAL_BOOKS} component={SearchBooksListView} />
      </React.Suspense>
    </PageHeader>
  </Switch>
);

export default Router;
