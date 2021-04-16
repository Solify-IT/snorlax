import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RegisterForm from 'src/views/Books.RegisterForm';
import PageHeader from '../PageHeader';
import HOME, { NEW_BOOK } from './routes';

const Router: React.FC = () => (
  <Switch>
    {/* {} es para ingresar código de JS o TS */}
    <Route exact path={HOME} />
    <PageHeader>
      <Route exact path={NEW_BOOK} component={RegisterForm} />
    </PageHeader>
  </Switch>
);

export default Router;
