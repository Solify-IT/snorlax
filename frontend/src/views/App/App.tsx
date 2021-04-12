import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'src/Components/Router';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App" data-testid="app">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
