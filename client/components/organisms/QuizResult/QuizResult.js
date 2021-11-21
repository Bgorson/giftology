import React from "react";
import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import { postQuizResults } from "../../../api/quiz";
import ProductResult from "../../organisms/ProductResult/ProductResult";

export default function QuizResult(props) {
  const { results } = props;

  const [productResults, setProductResults] = React.useState(null);
  React.useEffect(() => {
    const productPromise = Promise.resolve(postQuizResults(results));
    productPromise.then((products) => {
      setProductResults(products);
    });
  }, []);
  return (
    <Container>
      <Title>RESULTS</Title>
      <p>{JSON.stringify(results)}</p>
      {productResults && <ProductResult data={productResults} />}
    </Container>
  );
}
