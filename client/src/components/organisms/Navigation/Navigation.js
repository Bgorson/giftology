import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';
import logo from '../../../logo.png';

import {
  ActionItems,
  Navbar,
  Container,
  NavItem,
  NavLink,
  Title,
  LogoNavItem,
  Logo,
} from './styles.js';

export default function Navigation({ pathname }) {
  const navigate = useHistory();

  return (
    <Navbar>
      <Container>
        <LogoNavItem>
          <Logo
            onClick={() => {
              ReactGA.event({
                category: 'Navlink',
                action: 'Clicked Logo',
                label: 'Logo',
              });
              navigate.push('/');
            }}
            src={logo}
          />
        </LogoNavItem>
        <ActionItems>
          <NavItem>
            <NavLink
              as={Link}
              onClick={() => {
                ReactGA.event({
                  category: 'Navlink',
                  action: 'Clicked Home',
                  label: 'Home',
                });
              }}
              to="/"
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              as={Link}
              onClick={() => {
                ReactGA.event({
                  category: 'Navlink',
                  action: 'Clicked Quiz',
                  label: 'Quiz',
                });
              }}
              to="/quiz/who"
            >
              Take The Quiz
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              as={Link}
              onClick={() => {
                ReactGA.event({
                  category: 'Feedback',
                  action: 'Clicked Feedback',
                  label: 'Feedback',
                });
              }}
              to="/feedback"
            >
              Feedback
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              as={Link}
              onClick={() => {
                ReactGA.event({
                  category: 'Navlink',
                  action: 'Clicked About',
                  label: 'About',
                });
              }}
              to="/about"
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
