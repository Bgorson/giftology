import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router";
import { useLocation } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import WelcomePage from "_pages/WelcomePage";
import HomePage from "_pages/HomePage";
import LostPage from "_pages/LostPage";

import Navigation from "_organisms/Navigation";
import Footer from "_organisms/Footer";

export default function Main() {
  const location = useLocation();
  // const [loading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <ReactNotification />
      <Navigation pathname={location.pathname} />
      <div className="main">
        <Switch>
          <Route exact path="/" component={WelcomePage} />
          <Route path="/home" component={HomePage} />
          <Route path="*" component={LostPage} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

Main.propTypes = {

};
