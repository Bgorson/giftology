import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Main from '../Main';

function Root() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default Root;
