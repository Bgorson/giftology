import React, { useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactGA from "react-ga4";
import Login from "../../molecules/LoginButton";

import { UserContext } from "../../../context/UserContext";
import {
  ActionItems,
  Navbar,
  Container,
  NavItem,
  NavLink,
  Logo,
  LogoText,
  HamburgerMenu,
  MobileMenu,
} from "./styles.js";

function trackEvent(category, action, label) {
  ReactGA.event({ category, action, label });
}

function Navigation() {
  const navigate = useHistory();
  const { isLoggedIn, is_admin } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleLogoClick = useCallback(() => {
    trackEvent("Navlink", "Clicked Logo", "Logo");
    navigate.push("/");
  }, [navigate]);

  return (
    <Navbar>
      <Container>
        <Logo onClick={handleLogoClick}>
          <LogoText>Giftology</LogoText>
        </Logo>
        <HamburgerMenu
          className={isMobileMenuOpen ? "open" : "closed"}
          onClick={handleMobileMenuClick}
        >
          <span />
          <span />
          <span />
        </HamburgerMenu>
        <ActionItems isMobileMenuOpen={isMobileMenuOpen}>
          <NavItem>
            <NavLink
              as={Link}
              onClick={() => {
                trackEvent("Navlink", "Clicked Home", "Home");
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
                trackEvent("Navlink", "Clicked Quiz", "Quiz");
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
                trackEvent("Feedback", "Clicked Feedback", "Feedback");
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
                trackEvent("Navlink", "Clicked About", "About");
              }}
              to="/about"
            >
              About Us
            </NavLink>
          </NavItem>
          {is_admin && (
            <NavItem>
              <NavLink as={Link} to="/admin">
                Admin
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            {isLoggedIn ? (
              <NavLink
                as={Link}
                onClick={() => {
                  trackEvent("Navlink", "Clicked Profile", "Profile");
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
        </ActionItems>
        {isMobileMenuOpen && (
          <MobileMenu>
            <NavItem>
              <NavLink
                as={Link}
                onClick={() => {
                  trackEvent("Navlink", "Clicked Home", "Home");
                  setIsMobileMenuOpen(false);
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
                  trackEvent("Navlink", "Clicked Quiz", "Quiz");
                  setIsMobileMenuOpen(false);
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
                  trackEvent("Feedback", "Clicked Feedback", "Feedback");
                  setIsMobileMenuOpen(false);
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
                  trackEvent("Navlink", "Clicked About", "About");
                  setIsMobileMenuOpen(false);
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
                    trackEvent("Navlink", "Clicked Profile", "Profile");
                    setIsMobileMenuOpen(false);
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
          </MobileMenu>
        )}
      </Container>
    </Navbar>
  );
}
export default Navigation;
