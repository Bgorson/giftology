import React from "react";
import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import { getProducts } from "../../../api/products";

export default function QuizResult(props) {
  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    const productPromise = Promise.resolve(getProducts());
    productPromise.then((products) => {
      setAllProducts(products.products);
    });
  }, []);
  const { results } = props;
  console.log(allProducts);
  return (
    <Container>
      <Title>RESULTS</Title>
      <p>{JSON.stringify(results)}</p>
      {allProducts.length > 0 && (
        <p>{JSON.stringify(allProducts[0])}</p>
      )}
    </Container>
  );
}
