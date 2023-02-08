import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import Login from "../../molecules/LoginButton";

import { UserContext } from "../../../context/UserContext";
import {
  ActionItems,
  Navbar,
  Container,
  NavItem,
  NavLink,
  Title,
  LogoNavItem,
  Logo,
  LogoText,
} from "./styles.js";

export default function Navigation({ pathname }) {
  const navigate = useHistory();
  const { isLoggedIn } = useContext(UserContext);
  console.log("Navigation.js: isLoggedIn: ", isLoggedIn);
  return (
    <Navbar>
      <Container>
        <Logo
          onClick={() => {
            ReactGA.event({
              category: "Navlink",
              action: "Clicked Logo",
              label: "Logo",
            });
            navigate.push("/");
          }}
        >
          <LogoText>Giftology</LogoText>
        </Logo>
        <ActionItems>
          <NavItem>
            <NavLink
              as={Link}
              onClick={() => {
                ReactGA.event({
                  category: "Navlink",
                  action: "Clicked Home",
                  label: "Home",
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
                  category: "Navlink",
                  action: "Clicked Quiz",
                  label: "Quiz",
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
                  category: "Feedback",
                  action: "Clicked Feedback",
                  label: "Feedback",
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
                  category: "Navlink",
                  action: "Clicked About",
                  label: "About",
                });
              }}
              to="/about"
            >
              About Us
            </NavLink>
          </NavItem>
          <NavItem>
            {isLoggedIn ? (
              <NavLink
                as={Link}
                onClick={() => {
                  ReactGA.event({
                    category: "Navlink",
                    action: "Clicked Profile",
                    label: "Profile",
                  });
                }}
                to="/profile"
              >
                Profile
              </NavLink>
            ) : (
              <NavLink>
                <Login />
              </NavLink>
            )}
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
