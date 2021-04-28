import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../Loader';
import PageHeader from '../PageHeader';
import HOME, { NEW_BOOK, LIST_LOCAL_BOOKS, BOOK_DETAIL } from './routes';

const RegisterFormView = React.lazy(() => import('src/views/Books.RegisterForm'));
const FormViewBook = React.lazy(() => import('src/views/Books.FormViewBook'));
const LocalBooksListView = React.lazy(() => import('src/views/Inventory.LocalBooksList'));

const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <PageHeader>
      <React.Suspense fallback={<Loader isLoading />}>
        <Route path={NEW_BOOK} component={RegisterFormView} />
        <Route path={LIST_LOCAL_BOOKS} component={LocalBooksListView} />
        <Route path={BOOK_DETAIL} component={FormViewBook} />
      </React.Suspense>
      <Route path={HOME} />
    </PageHeader>
  </Switch>
);

export default Router;
