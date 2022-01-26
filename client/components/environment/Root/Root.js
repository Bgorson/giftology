import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import { BrowserRouter } from 'react-router-dom';
import Main from '../Main';
ReactGA.initialize('300818648');
console.log('visit');
ReactGA.pageview(window.location.pathname + window.location.search);

function Root() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default Root;
