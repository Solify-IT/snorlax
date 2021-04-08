import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      {/* {} es para ingresar código de JS o TS */}
      <Route exact path="/libros/nuevo" component={() => <>Hola</>} />
    </Switch>
  </BrowserRouter>
);

export default Router;
