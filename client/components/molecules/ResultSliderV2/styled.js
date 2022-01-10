import styled from 'styled-components';

export const Category = styled.h1`
  font-size: 30px;
  text-transform: uppercase;
`;
export const CategoryContainer = styled.div``;
export const CategoryImage = styled.img`
  max-width: 150px;
  flex-basis: 33%;
  margin: auto;
`;
export const CategoryScore = styled.h2`
  font-size: 1em;
  flex-basis: 33%;
  margin: auto;
`;
export const Container = styled.div`
  margin-top: 10em;
  display: flex;
  flex-direction: column;
`;
export const FullContainer = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  gap: 5em;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
`;
export const ProductTitle = styled.p`
  align-self: center;
  margin: 0.5em 0 1em 0;
  font-weight: bold;
`;

export const ProductImage = styled.div``;
export const ProductText = styled.p``;

export const ProductScore = styled.p`
  color: red;
  align-self: center;
`;
export const SingleProductContainer = styled.div``;
export const CategoryDescription = styled.p`
  font-size: 15px;
`;

export const CategoryDiv = styled.div`
  margin: 2em auto;
  width: 80%;
`;
export const SlickContainer = styled.div`
  img {
    width: auto;
    margin: auto;
  }
  .slick-prev:before {
    color: black;
  }
  .slick-next:before {
    color: black;
  } /* the slides */
  .slick-list {
    margin: 0 -5px;
  }
  .slick-slide > div {
    padding: 0 5px;
  }
`;
