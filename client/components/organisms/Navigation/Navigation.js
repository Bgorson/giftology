import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

// import Navbar from 'react-bulma-companion/lib/Navbar';
// import Container from 'react-bulma-companion/lib/Container';
// import Title from 'react-bulma-companion/lib/Title';

import {
  ActionItems,
  EmptyDiv,
  Navbar,
  Container,
  NavItem,
  NavLink,
  Title,
  Logo,
} from "./styles.js";

export default function Navigation({ pathname }) {
  const history = useHistory();

  return (
    <Navbar>
      <Container>
        <NavItem>
          <Logo onClick={() => history.push("/")} src="./images/logo.png" />
        </NavItem>
        <ActionItems>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/quiz">Take the quiz</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">About Us</NavLink>
          </NavItem>
        </ActionItems>
        <EmptyDiv />
      </Container>
    </Navbar>
  );
}

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};
