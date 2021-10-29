import React from "react";
import ReactDOM from "react-dom";
import Main from "../Main";
import { BrowserRouter } from "react-router-dom";

function Root() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default Root;
