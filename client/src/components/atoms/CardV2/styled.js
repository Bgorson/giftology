import styled, { css } from "styled-components";

export const FlavorText = styled.p`
  margin: 0;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.8);
`;

export const CardContainer = styled.div`
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
  position: relative;
  text-align: left;
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
`;
export const ProductDescriptionHeading = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;
export const ProductDescription = styled.p`
  font-size: 18px;
`;
export const ProductTags = styled.div`
  display: flex;
  padding-top: 16px;
  flex-wrap: wrap;
  gap: 1em;
  @media (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 2em;
  }
`;
export const Tag = styled.div`
  border: 1px solid grey;
  width: fit-content;
  padding: 12px 20px;
`;
export const ButtonContainer = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;
export const FancyButton = styled.button`
  border-radius: 1.5em;
  background-color: inherit;
  white-space: nowrap;
  margin: 10px 10px 0 0;
  color: black;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 16px;

  &:focus {
  }

  &:after {
  }
  &:active {
  }

  &:hover {
    background-color: #44a2bb;
    color: white;
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
