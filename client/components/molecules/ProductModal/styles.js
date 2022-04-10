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
export const Button = styled.button``;
export const ProductImage = styled.div``;
export const MobileWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;
export const DesktopWrapper = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ProductDescriptionHeading = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
