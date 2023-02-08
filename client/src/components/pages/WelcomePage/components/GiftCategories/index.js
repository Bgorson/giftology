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

export default function GiftCategories() {
  return (
    <Container>
      <InnerContainer>
        <Title>Select a Category</Title>
        <CategoryContainer>
          <Tile>
            <TileText>
              <Image src={personalized_tile} />
              <HeaderText>Personalized Gifts</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
          <Tile>
            <Image src={romantic_tile} />
            <TileText>
              <HeaderText>Romantic Gifts</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
          <Tile>
            <Image src={experience_tile} />
            <TileText>
              <HeaderText>Experience Gifts</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
          <Tile>
            <Image src={jewelry_tile} />
            <TileText>
              <HeaderText>Jewelry</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
          <Tile>
            <Image src={date_night_tile} />
            <TileText>
              <HeaderText>Date Night Gifts</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
          <Tile>
            <Image src={self_care_tile} />
            <TileText>
              <HeaderText>Self-Care Gifts</HeaderText>
              <Description>
                Buy the best and most romantic gifts for your loved ones
              </Description>
            </TileText>
          </Tile>
        </CategoryContainer>
      </InnerContainer>
    </Container>
  );
}
