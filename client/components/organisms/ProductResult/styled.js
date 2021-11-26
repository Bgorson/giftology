import styled from "styled-components";

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
  margin-top: 5em;
  width: 90%;
`;
export const FullContainer = styled.div`
  display: flex;
  gap: 10em;
`;

export const ProductContainer = styled.div`
  display: flex;
  flex-basis: 50%;
  gap: 40px;

  justify-content: center;
  margin-bottom: 2em;
`;
export const ProductTitle = styled.p`
  align-self: center;
`;

export const ProductImage = styled.div`
  min-width: 300px;
  margin-bottom:5em;
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
