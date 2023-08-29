import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";

import { BrowserRouter } from "react-router-dom";
import Main from "../Main";
ReactGA.initialize("395865648");

function Root() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default Root;
