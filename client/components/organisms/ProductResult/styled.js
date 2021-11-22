import styled from "styled-components";

export const Category = styled.h1`
  font-size: 2em;
  /* min-width: 250px; */
  flex-basis: 33%;
  margin: auto;
`;
export const CategoryContainer = styled.div`
  display: flex;
  flex-basis: 50%;
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
`;
export const FullContainer = styled.div`
  display: flex;
`;

export const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
  justify-content: center;
  margin-bottom:2em;
`;
export const ProductTitle = styled.p`
  align-self: center;
`;

export const ProductImage = styled.img`
  max-width: 50px;
`;
export const SingleProductContainer = styled.div`
  display: flex;
  gap: 10px;
`;
