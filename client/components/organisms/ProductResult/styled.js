import styled from 'styled-components';

export const Category = styled.h1`
  font-size: 30px;
  /* min-width: 250px; */
  text-transform: uppercase;
`;
export const CategoryContainer = styled.div`
  display: flex;
  flex-basis: 30%;
  flex-direction: column;
`;
export const CategoryImage = styled.img`
  max-width: 150px;
  flex-basis: 33%;
  margin: auto;
`;
export const CategoryScore = styled.h2`
  font-size: 1em;
  flex-basis: 33%;
  margin: auto;
  width: 100px;
`;
export const Container = styled.div`
  margin-top: 10em;
`;
export const FullContainer = styled.div`
  width: 90%;
  margin: auto;
  display: flex;
  gap: 5em;
`;

export const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
`;
export const ProductTitle = styled.p`
  align-self: center;
`;

export const ProductImage = styled.div`
  max-width: 300px;
  margin-bottom: 5em;
`;

export const ProductScore = styled.p`
  color: red;
  align-self: center;
`;
export const SingleProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: lightgray 1px solid;
`;
export const CategoryDescription = styled.p`
  font-size: 15px;
`;
