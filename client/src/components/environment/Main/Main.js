import React, { useEffect } from "react";

import { useLocation, Switch, Route, Redirect } from "react-router-dom";
import WelcomePage from "../../pages/WelcomePage";
import LostPage from "../../pages/LostPage";
import QuizPage from "../../pages/QuizPage";
import AboutPage from "../../pages/AboutPage";
import ProfilePage from "../../pages/ProfilePage";
import FavoritesPage from "../../pages/FavoritesPage";
import FeedbackPage from "../../pages/Feedbackpage";
import ProductPage from "../../pages/ProductPage";
import AdminPage from "../../pages/AdminPage";
import Navigation from "../../organisms/Navigation";
import Footer from "../../organisms/Footer";
import DemoPage from "../../pages/DemoPage";
import CategoryPage from "../../pages/CategoryPage";

import { Container, MainContainer } from "./styles";
import "./index.css";

export default function Main() {
  const location = useLocation();
  // const [loading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Container>
      <Navigation pathname={location.pathname} />
      <MainContainer>
        <Switch>
          <Route exact path="/" component={WelcomePage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/product/:id/" component={ProductPage} />
          <Route path="/feedback" component={FeedbackPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/demopage" component={DemoPage} />
          <Route
            path="/favorites/:quizId"
            render={(props) => <FavoritesPage {...props} />}
          />
          <Route
            path="/categories/:quizId/:category"
            component={CategoryPage}
          />

          <Route path="/admin" component={AdminPage} />
          {/* <Redirect to="/not-found" /> */}
          <Redirect to="/" />
          {/* <AdminPage setToken={setToken} /> */}
          {/* <Route path="/portal/product">
            {token && <Product product={product} />}
          </Route> */}
          {/* <Route path="/portal">
            {token ? (
              <Portal onProductSelect={handleProductSelect} />
            ) : (
              <LostPage />
            )}
          </Route> */}
          <Route path="*" element={LostPage} />
        </Switch>
      </MainContainer>
      <Footer />
    </Container>
  );
}

Main.propTypes = {};
