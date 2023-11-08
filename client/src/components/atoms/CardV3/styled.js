import styled, { css } from "styled-components";

export const FlavorText = styled.p`
  padding-top: 0.5em;
  margin: 0;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.8);
`;

export const CardContainer = styled.div`
  border-radius: 25px;

  color: black;
  position: relative;
  height: 510px;

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
  text-align: left;
  width: 300px;

  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: space-between;
  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ImageWrapper = styled.div`
  height: 350px;
  width: 300px;
  border-radius: 25px 25px 0 0;

  background-color: #f5f5f5;
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
  background-color: #4896c2;
  text-transform: uppercase;
  color: white;
  font-size: 12px;
  max-width: 150px;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  margin: 0;
  align-self: flex-end;
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
`;
export const Card = styled.div`
  width: 400px;
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
export const CardBackContainer = styled.div`
  border-radius: 25px;
  color: black;
  position: relative;
  height: 510px;

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
export const CardBackContentContainer = styled.div`
  text-align: left;
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: space-between;
`;
export const ProductDescriptionHeading = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;
export const ProductDescription = styled.p`
  font-size: 16px;
`;
export const MainSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: 2em auto;
  align-items: center;
  justify-content: center;
  gap: 1em;
  border: lightgray 1px solid;
  @media (min-width: 768px) {
    width: 100%;
  }
`;

export const CategoryTitleCard = styled.h1`
  position: sticky;
  top: 0px;
  width: 100%;
  margin: auto;
  z-index: 999;
  border-radius: 25px;
  text-align: center;
  background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
  @media (min-width: 768px) {
    top: 75px;
  }
`;
export const ViewMoreCard = styled.div`
  width: 400px;
  margin: auto;
`;
