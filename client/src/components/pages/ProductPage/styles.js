import styled, { css } from "styled-components";

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: 16px;
  margin-left: 2em;
`;
export const Image = styled.img`
  object-fit: contain;
  max-width: 600px;
  max-height: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ProductTitle = styled.h1`
  font-size: 26px;
  font-weight: bold;
`;
export const ProductDescription = styled.p`
  font-size: 16px;
`;

export const ProductDescriptionHeading = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
export const FancyButton = styled.button`
  background-color: inherit;
  white-space: nowrap;
  color: black;
  cursor: pointer;
  padding: 12px 24px;
  font-size: 20px;

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
  @media (max-width: 768px) {
    background-color: #44a2bb;
    color: white;
    min-width: 100%;
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

export const ProductContainer = styled.div`
  display: flex;
  padding-top: 5em;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const ProductTags = styled.div`
  display: flex;
  padding-top: 40px;
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
  display: flex;
  gap: 1em;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
  padding-bottom: 2em;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;
export const ProductPrice = styled.div`
  margin: 0 24px 0 auto;
  font-size: 32px;
  @media (max-width: 768px) {
    margin: 24px;
  }
`;
