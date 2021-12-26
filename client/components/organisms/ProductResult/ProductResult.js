import React from 'react';
import Section from 'react-bulma-companion/lib/Section';
import Title from 'react-bulma-companion/lib/Title';
import { postQuizResults } from '../../../api/quiz';
import {
  Category,
  CategoryContainer,
  CategoryDescription,
  CategoryScore,
  Container,
  FullContainer,
  ProductContainer,
  ProductImage,
  ProductTitle,
  ProductScore,
  SingleProductContainer,
} from './styled';

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
  const arrayOfCategories = groupBy(products, 'category');
  categoryScores.sort((a, b) => (b.score > a.score ? 1 : -1));
  categoryScores.forEach((category) => {
    for (let i = 0; i < arrayOfCategories[category.name].length; i++) {
      if (arrayOfCategories[category.name][i].score) {
        arrayOfCategories[category.name].sort((a, b) => b.score - a.score);
      }
    }
  });
  // Should just be able to go through available categories
  // and display products and names
  return (
    <Container>
      {categoryScores.map((category, index) => (
        <FullContainer key={index}>
          <CategoryContainer key={index}>
            <Category>{category.name}</Category>
            <CategoryDescription>
              {
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut nisl mattis, scelerisque arcu eget, auctor orci. In arcu turpis.'
              }{' '}
            </CategoryDescription>
            {/* <CategoryImage src="/images/default-profile.png" /> */}
            <CategoryScore>Score: {category.score}</CategoryScore>
          </CategoryContainer>
          <ProductContainer>
            {arrayOfCategories[category.name].map((product, index) => (
              <SingleProductContainer key={index}>
                <ProductImage
                  dangerouslySetInnerHTML={{ __html: product.htmlTag }}
                />
                <ProductTitle>{product.productName}</ProductTitle>
                <ProductScore>Score: {product.score}</ProductScore>
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
