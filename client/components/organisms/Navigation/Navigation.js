import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import ReactGA from 'react-ga';

// import Navbar from 'react-bulma-companion/lib/Navbar';
// import Container from 'react-bulma-companion/lib/Container';
// import Title from 'react-bulma-companion/lib/Title';

import {
  ActionItems,
  Navbar,
  Container,
  NavItem,
  NavLink,
  Title,
  Logo,
} from './styles.js';

export default function Navigation({ pathname }) {
  const history = useHistory();

  return (
    <Navbar>
      <Container>
        <NavItem>
          <Logo
            onClick={() => {
              ReactGA.event({
                category: 'Navlink',
                action: 'Clicked Logo',
                label: 'Logo',
              });
              history.push('/');
            }}
            src="./images/logo.png"
          />
        </NavItem>
        <ActionItems>
          <NavItem>
            <NavLink
              onClick={() => {
                ReactGA.event({
                  category: 'Navlink',
                  action: 'Clicked Home',
                  label: 'Home',
                });
              }}
              href="/"
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => {
                ReactGA.event({
                  category: 'Navlink',
                  action: 'Clicked Quiz',
                  label: 'Quiz',
                });
              }}
              href="/quiz"
            >
              Take the quiz
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => {
                ReactGA.event({
                  category: 'Navlink',
                  action: 'Clicked About',
                  label: 'About',
                });
              }}
              href="/about"
            >
              About Us
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <a href="/auth/google">Sign In with Google</a>
          </NavItem> */}
        </ActionItems>
      </Container>
    </Navbar>
  );
}

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};
