import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";

import { BrowserRouter } from "react-router-dom";
import Main from "../Main";
ReactGA.initialize("UA-218196758-1");

function Root() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default Root;
