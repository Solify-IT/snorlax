import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RegisterForm from 'src/views/Books.RegisterForm';
import { NEW_BOOK } from './routes';

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      {/* {} es para ingresar código de JS o TS */}
      <Route exact path={NEW_BOOK} component={RegisterForm} />
    </Switch>
  </BrowserRouter>
);

export default Router;
