import styled from 'styled-components';

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
export const ProductPrice = styled.div``;
export const ProductTags = styled.div``;

export const ProductDescriptionHeading = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
export const FancyButton = styled.button`
  background-color: inherit;
  white-space: nowrap;
  min-width: 280px;
  color: black;
  cursor: pointer;
  border-radius: 1000px;
  padding: 0.5em;
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
`;

export const ProductContainer = styled.div`
  display: flex;
`;
