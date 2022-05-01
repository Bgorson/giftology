import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import { BrowserRouter } from 'react-router-dom';
import Main from '../Main';
ReactGA.initialize('UA-218196758-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function Root() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default Root;
