import React from "react";
import ReactDOM from "react-dom";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.compat.css";

import Root from "_environment/Root";

ReactDOM.render(
  <React.StrictMode>
      <Root />
  </React.StrictMode>,
  document.getElementById("app")
);
