import React from "react";
import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import { postQuizResults } from "../../../api/quiz";
import { Category } from "./styled";

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
  console.log(arrayOfCategories)

  // Should just be able to go through available categories
  // and display products and names
  return (
    <div>
      {categoryScores.map((category, index) => (
        <React.Fragment key={index}>
          <Category>{category.name}</Category>
          <h1>{category.score}</h1>
          {arrayOfCategories[category.name].map((product, index) => (
            <p key={index}>{product.productName}</p>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
