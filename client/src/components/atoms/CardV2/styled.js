import styled, { css } from "styled-components";

export const FlavorText = styled.p`
  margin: 0;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.8);
`;

export const CardContainer = styled.div`
  border-radius: 25px;

  color: black;
  position: relative;
  height: 550px;

  cursor: pointer;
  color: black;
  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 768px) {
    flex-basis: auto;
  }
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

export const CardContentContainer = styled.div`
  position: relative;
  display: flex;
  padding: 8px;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
export const CardBackContentContainer = styled.div`
  text-align: left;
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: space-between;
`;

export const ImageWrapper = styled.div`
  height: 350px;
  border-radius: 25px 25px 0 0;
  @media (max-width: 768px) {
    border: none;
  }
  width: 100%;

  img {
    margin: auto;
    height: 350px;
    object-fit: scale-down;

    width: 100%;
  }
`;
export const SubTextContainer = styled.div``;
export const BadgeContainer = styled.div`
  overflow: inherit !important;
  position: absolute;
  z-index: 60;
  top: -50px;
  right: 5px;
  background-color: #44a2bb;
  border-radius: 33%;
  color: white;
  padding: 5px;
`;
export const BadgeText = styled.p`
  margin: 0;
`;
export const FavoriteContainer = styled.div`
  position: absolute;
  z-index: 60;
  top: 50px;
  right: 20px;
  width: 30px;
  height: 30px;
`;

export const Image = styled.img`
  width: 100%;
  border-radius: 25px 25px 0 0;
`;
export const ProductDescriptionHeading = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;
export const ProductDescription = styled.p`
  font-size: 16px;
`;
export const ProductTags = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const Tag = styled.p`
  margin-top: 0;
`;
export const ButtonContainer = styled.div`
  margin: auto;
  width: 100%;
  text-align: center;
`;
export const TopButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;
export const FancyButton = styled.button`
  border-radius: 1.5em;
  width: 150px;
  background-color: inherit;
  white-space: nowrap;
  margin: 10px 0 0 0;
  color: black;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid black;

  &:focus {
  }

  &:after {
  }
  &:active {
  }

  &:hover {
  }

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
      background-color: grey;
      &:hover {
        background-color: grey;
        color: black;
      }
    `}
  ${(props) =>
    props.isPurchase &&
    css`
      background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
      border: 1px solid rgba(0, 0, 0, 0.15);
      &:hover {
        background-color: grey;
        color: black;
      }
    `}
`;
export const Button = styled.button``;
export const ProductPrice = styled.div`
  margin: 0 24px 0 auto;
  font-size: 18px;
`;

export const CardBackContainer = styled.div`
  border-radius: 25px;
  color: black;
  position: relative;
  height: 550px;

  cursor: pointer;
  color: black;
  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 768px) {
    flex-basis: auto;
  }
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

export const ScoreTag = styled.p``;
export const ExtraInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;
export const FancyDisplayButton = styled.div`
  border-radius: 1.5em;
  width: 150px;
  white-space: nowrap;
  margin: 10px 0 0 0;
  color: black;
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid black;
  cursor: pointer;
  &:focus {
  }

  &:after {
  }
  &:active {
  }

  &:hover {
  }

  ${(props) =>
    props.score > 0.9 &&
    css`
      background: lightgreen;
      border: 1px solid rgba(0, 0, 0, 0.15);
    `}
  ${(props) =>
    props.score > 0.5 &&
    props.score < 0.9 &&
    css`
      background: yellow;
      border: 1px solid rgba(0, 0, 0, 0.15);
    `}
    ${(props) =>
    props.score < 0.5 &&
    css`
      background: lightblue;
      border: 1px solid rgba(0, 0, 0, 0.15);
    `}
`;
