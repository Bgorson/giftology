import React, { useState } from 'react';
import Section from 'react-bulma-companion/lib/Section';
import { Audio } from 'react-loader-spinner';

// import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';
import { postQuizResults } from '../../../api/quiz';
import ProductResult from '../../organisms/ProductResult/ProductResult';

export default function QuizResult(props) {
  const { results } = props;
  const [isLoading, setIsLoading] = useState(true);
  console.log('is loading', isLoading);

  const [productResults, setProductResults] = React.useState(null);
  React.useEffect(() => {
    const productPromise = Promise.resolve(postQuizResults(results));
    productPromise.then((products) => {
      setIsLoading(false);
      setProductResults(products);
    });
  }, []);
  return (
    <React.Fragment>
      <div>
        <Title>RESULTS</Title>
        <p>{JSON.stringify(results)}</p>
      </div>
      {isLoading && (
        <Audio heigth="100" width="100" color="grey" ariaLabel="loading" />
      )}
      {productResults && !isLoading && <ProductResult data={productResults} />}
    </React.Fragment>
  );
}
