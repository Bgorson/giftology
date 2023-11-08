import React from "react";

import { useParams } from "react-router-dom";
import { useProducts } from "../../../context/ProductsContext.js";
import { MainPage, CategoryHeader } from "./styles.js";
import ProductResult from "../../organisms/ProductResult/ProductResult.js";

export default function CategoryPage() {
  let { category, quizId } = useParams();
  const { products } = useProducts();
  let propShape = {
    data: {
      products: products[category],
      quizData: {
        id: quizId,
      },
    },
    results: [],
  };

  return (
    <MainPage>
      <CategoryHeader>{category}</CategoryHeader>
      <ProductResult
        categorySpecific={true}
        data={propShape.data}
        results={propShape.results}
      />
    </MainPage>
  );
}
