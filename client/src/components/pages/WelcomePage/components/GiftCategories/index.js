import React from "react";
import {
  Title,
  Container,
  CategoryContainer,
  Tile,
  Image,
  HeaderText,
  Description,
  TileText,
  InnerContainer,
} from "./styles";
import personalized_tile from "../../../../../personalized_tile.png";
import romantic_tile from "../../../../../romantic_tile.png";
import date_night_tile from "../../../../../date_night_tile.png";
import experience_tile from "../../../../../experience_tile.png";
import jewelry_tile from "../../../../../jewelry_tile.png";
import self_care_tile from "../../../../../self_care_tile.png";
import Gifts_for_Adventurers from "../../../../../Gifts_for_Adventurers.jpeg";
import Gifts_for_Entertainers from "../../../../../Gifts_for_Entertainers.jpeg";
import Gifts_for_the_Day_Dreamer from "../../../../../Gifts_for_the_Day_Dreamer.jpeg";
import ReactGA from "react-ga";

export default function GiftCategories() {
  const startQuiz = (quizData) => {
    localStorage.setItem("preSelect", JSON.stringify(quizData));
    window.location.href = "/quiz";
  };

  return (
    <Container>
      <InnerContainer>
        <Title>Select a Category</Title>
        <CategoryContainer>
          <Tile>
            <TileText
              onClick={() => {
                startQuiz({
                  hobbies: "artsAndCrafts",
                  tags: ["artsy", "creative", "quirky"],
                }),
                  ReactGA.event({
                    category: "User",
                    action: "Clicked on the Day Dreamer category",
                  });
              }}
            >
              <Image src={Gifts_for_the_Day_Dreamer} />
              <HeaderText>Gifts for the Day Dreamer</HeaderText>
              <Description>Unleash their creative side</Description>
            </TileText>
          </Tile>

          <Tile
            onClick={() => {
              ReactGA.event({
                category: "User",
                action: "Clicked on the Sampler Packs category",
              });
              startQuiz({
                tags: ["delicious"],
                additionalTags: ["tea", "coffee"],
              });
            }}
          >
            <Image src={romantic_tile} />
            <TileText>
              <HeaderText>Gifts in Sampler Packs</HeaderText>
              <Description>Can’t decide? Try a bit of everything.</Description>
            </TileText>
          </Tile>
          <Tile
            onClick={() => {
              ReactGA.event({
                category: "User",
                action: "Clicked on the Animal Lovers category",
              });
              startQuiz({
                additionalTags: ["cats", "dogs"],
              });
            }}
          >
            <Image src={experience_tile} />
            <TileText>
              <HeaderText>Gifts for Animal Lovers</HeaderText>
              <Description>
                Gifts for furry friends, and people that love them
              </Description>
            </TileText>
          </Tile>
          <Tile
            onClick={() => {
              ReactGA.event({
                category: "User",
                action: "Clicked on the Adventurers category",
              });
              startQuiz({
                hobbies: "camping",
                additionalTags: ["outdoors", "travel"],
              });
            }}
          >
            <Image src={Gifts_for_Adventurers} />
            <TileText>
              <HeaderText>Gifts for Adventurers</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
          <Tile
            onClick={() => {
              ReactGA.event({
                category: "User",
                action: "Clicked on the Entertainers category",
              });
              startQuiz({
                hobbies: ["homeChef", "mixology"],
              });
            }}
          >
            <Image src={date_night_tile} />
            <TileText>
              <HeaderText>Gifts for Entertainers</HeaderText>
              <Description>
                Throw a dinner party with these great items
              </Description>
            </TileText>
          </Tile>
          <Tile
            onClick={() => {
              ReactGA.event({
                category: "User",
                action: "Clicked on the Entertainers category",
              });
              startQuiz({
                tags: ["eco-friendly"],
                additionalTags: ["bathAndBody", "homeDecor"],
              });
            }}
          >
            <Image src={self_care_tile} />
            <TileText>
              <HeaderText>Gifts for Self-Care</HeaderText>
              <Description>
                Our best gifts to pamper your loved ones
              </Description>
            </TileText>
          </Tile>
        </CategoryContainer>
      </InnerContainer>
    </Container>
  );
}
