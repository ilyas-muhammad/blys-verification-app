import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import './assets/css/index.css';
import App from './App';
import Success from './Success';

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={App} />
    <Route exact path="/success" component={Success} />
  </BrowserRouter>,
  document.getElementById('root')
);

