import React from "react";
import { Link } from "react-router-dom";

import {
  Footer,
  Menu,
  MenuHeader,
  MenuInput,
  MenuItem,
  MenuLink,
  MenuText,
  MenuGrid,
} from "./styles";

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <Footer>
      <Menu>
        <MenuItem>
          <MenuHeader>Catalog</MenuHeader>
          <MenuGrid grid={true}>
            <MenuLink to="/catalog">Personalized Gifts</MenuLink>
            <MenuLink to="/catalog">Romantic Gifts</MenuLink>
            <MenuLink to="/catalog">Experience Gifts</MenuLink>
            <MenuLink to="/catalog">Jewelry</MenuLink>
            <MenuLink to="/catalog">Date-night gifts</MenuLink>
            <MenuLink to="/catalog">Self-Care gifts</MenuLink>
          </MenuGrid>
        </MenuItem>

        <MenuItem>
          <MenuHeader>Giftology</MenuHeader>
          <MenuGrid grid={false}>
            <MenuLink as={Link} to="/about">
              About us
            </MenuLink>
            <MenuLink as={Link} to="/catalog">
              Feedback
            </MenuLink>
            <MenuLink as={Link} to="/quiz/who">
              Take the Quiz
            </MenuLink>
            <MenuLink as={Link} to="/about">
              Affiliate Program
            </MenuLink>
          </MenuGrid>
        </MenuItem>
        <MenuItem style={{ maxWidth: "285px" }}>
          <MenuHeader>NewsLetter</MenuHeader>
          <MenuText>
            Subscribe to our newsletter and get updates when a special occasion
            is coming up with relevant gift ideas
          </MenuText>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e.target[0].value);
              e.target[0].value = "";
            }}
          >
            <MenuInput placeholder="Email Address" />
          </form>
        </MenuItem>
      </Menu>
      <p>{`©${year} Giftology™`}</p>
    </Footer>
  );
}
