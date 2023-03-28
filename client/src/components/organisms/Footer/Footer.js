import React from "react";
import { Link } from "react-router-dom";
import { postToMailingList } from "./../../../api/postToMailingList";

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
  const handleSubmit = (email) => {
    console.log("submit", email);
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (validateEmail(email)) {
      postToMailingList("unknown", email);
    }
  };
  const startQuiz = (quizData) => {
    localStorage.setItem("preSelect", JSON.stringify(quizData));
    window.location.href = "/quiz";
  };
  return (
    <Footer>
      <Menu>
        <MenuItem>
          <MenuHeader>Catalog</MenuHeader>
          <MenuGrid grid={true}>
            <MenuLink
              onClick={() =>
                startQuiz({
                  hobbies: "artsAndCrafts",
                  tags: ["artsy", "creative", "quirky"],
                })
              }
            >
              The Day Dreamer
            </MenuLink>
            <MenuLink
              onClick={() =>
                startQuiz({
                  tags: ["delicious"],
                  additionalTags: ["tea", "coffee"],
                })
              }
            >
              Sampler Packs
            </MenuLink>
            <MenuLink
              onClick={() =>
                startQuiz({
                  additionalTags: ["cats", "dogs"],
                })
              }
            >
              Animal Lovers
            </MenuLink>
            <MenuLink
              onClick={() =>
                startQuiz({
                  hobbies: "camping",
                  additionalTags: ["outdoors", "travel"],
                })
              }
            >
              Adventurers
            </MenuLink>
            <MenuLink
              onClick={() =>
                startQuiz({
                  hobbies: ["homeChef", "mixology"],
                })
              }
            >
              Entertainers
            </MenuLink>
            <MenuLink
              onClick={() =>
                startQuiz({
                  tags: ["eco-friendly"],
                  additionalTags: ["bathAndBody", "homeDecor"],
                })
              }
            >
              Self-Care
            </MenuLink>
          </MenuGrid>
        </MenuItem>

        <MenuItem>
          <MenuHeader>Giftology</MenuHeader>
          <MenuGrid grid={false}>
            <MenuLink as={Link} to="/about">
              About us
            </MenuLink>
            <MenuLink as={Link} to="/feedback">
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
              handleSubmit(e.target[0].value);
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
