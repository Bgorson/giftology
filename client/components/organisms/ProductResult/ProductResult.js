import React from "react";
import Section from "react-bulma-companion/lib/Section";
import Title from "react-bulma-companion/lib/Title";
import { postQuizResults } from "../../../api/quiz";
import {
  Category,
  CategoryContainer,
  CategoryImage,
  CategoryScore,
  Container,
  FullContainer,
  ProductContainer,
  ProductImage,
  ProductTitle,
  SingleProductContainer,
} from "./styled";

function groupBy(arr, property) {
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

export default function ProductResult(props) {
  const { data } = props;
  const { products, categoryScores } = data;
  const arrayOfCategories = groupBy(products, "category");
  console.log("cat scores", categoryScores);
  categoryScores.sort((a, b) => (b.score > a.score ? 1 : -1));

  // Should just be able to go through available categories
  // and display products and names
  return (
    <Container>
      {categoryScores.map((category, index) => (
        <FullContainer key={index}>
          <CategoryContainer key={index}>
            <Category>{category.name}</Category>
            <CategoryImage src="/images/default-profile.png" />
            <CategoryScore>Score: {category.score}</CategoryScore>
          </CategoryContainer>
          <ProductContainer>
            {arrayOfCategories[category.name].map((product, index) => (
              <SingleProductContainer>
                <ProductImage src="/images/default-profile.png" />
                <ProductTitle key={index}>{product.productName}</ProductTitle>
              </SingleProductContainer>
            ))}
          </ProductContainer>
        </FullContainer>
      ))}
    </Container>
  );
}
/* <p key={index}>{"product"}</p>
            <p key={index}>{"product"}</p>
            <p key={index}>{"product"}</p> */
