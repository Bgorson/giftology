import React, { useEffect, useState } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage';
import HomePage from '../../pages/HomePage';
import LostPage from '../../pages/LostPage';
import QuizPage from '../../pages/QuizPage';
import AboutPage from '../../pages/AboutPage';
import AdminPage from '../../pages/AdminPage';
import Portal from '../../pages/Portal';
import Product from '../../pages/Portal/Product';
import Navigation from '../../organisms/Navigation';
import Footer from '../../organisms/Footer';

import { Container, MainContainer } from './styles';
import './index.css';

export default function Main() {
  const location = useLocation();
  // const [loading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const [token, setToken] = useState();
  const [product, setProduct] = useState();

  const handleProductSelect = (product) => {
    setProduct(product);
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setToken(foundUser);
    }
  }, []);
  return (
    <Container>
      <Navigation pathname={location.pathname} />
      <MainContainer>
        <Switch>
          <Route exact path="/" component={WelcomePage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/admin" component={AdminPage} />
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
