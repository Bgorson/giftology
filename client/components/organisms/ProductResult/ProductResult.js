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

import ResultSlider from '../../molecules/ResultSlider/ResultSlider';
import ResultSliderV2 from '../../molecules/ResultSliderV2';

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
    <ResultSliderV2
      categoryScores={categoryScores}
      arrayOfCategories={arrayOfCategories}
    />
  );
}
/* <p key={index}>{"product"}</p>
            <p key={index}>{"product"}</p>
            <p key={index}>{"product"}</p> */
