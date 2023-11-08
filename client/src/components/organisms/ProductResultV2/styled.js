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
  gap: 1em;
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
export const EmptyText = styled.p`
  font-size: 50px;
  text-align: center;
`;
export const ProductGrid = styled.div`
  max-width: 1250px;
  margin: auto;
`;

export const Filter = styled.div`
  margin-bottom: 36px;
  font-size: 2em;
  margin-right: 16px;
`;
export const FilterSelect = styled.select`
  font-size: 0.75em;
`;
export const FilterLabel = styled.label``;
export const FilterOption = styled.option``;
export const LoaderContainer = styled.div`
  width: 100%;
  padding: 2em 0;
  text-align: center;
  & > div {
    justify-content: center;
    padding-top: 1em;
  }
  @media (max-width: 768px) {
    padding-top: 0;
  }
`;
export const AIGenerated = styled.div`
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
