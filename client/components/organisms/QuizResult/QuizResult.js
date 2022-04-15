import React, { useState } from 'react';
import Section from 'react-bulma-companion/lib/Section';
import { Audio } from 'react-loader-spinner';

// import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';
import { postQuizResults } from '../../../api/quiz';
import { Disclosure, TopContainer, Link } from './styles';
import ProductResult from '../../organisms/ProductResult/ProductResult';
import ReactGA from 'react-ga';

export default function QuizResult(props) {
  const { results } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [resArray, setResArray] = useState([]);

  function groupBy(arr, property) {
    console.log('HIT');
    return arr.reduce((memo, x) => {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }
  ReactGA.event({
    category: 'Quiz Results',
    action: 'Finished Quiz',
  });

  const [productResults, setProductResults] = React.useState(null);
  React.useEffect(() => {
    if (Object.keys(results).length === 0) {
      const storedResults = localStorage.getItem('quizResults');
      const productPromise = Promise.resolve(
        postQuizResults(JSON.parse(storedResults))
      );
      productPromise.then((productRes) => {
        const { products, categoryScores } = productRes;

        const arrayOfCategories = groupBy(products, 'category');

        categoryScores.sort((a, b) => (b.score > a.score ? 1 : -1));
        categoryScores.forEach((category) => {
          for (let i = 0; i < arrayOfCategories[category.name].length; i++) {
            if (arrayOfCategories[category.name][i].score) {
              //TODO: Add a sort for breaking tie to be price. Highest wins.
              arrayOfCategories[category.name].sort(
                (a, b) => b.score - a.score
              );
              arrayOfCategories[category.name].sort((a, b) =>
                b.score === a.score
                  ? b.productBasePrice - a.productBasePrice
                  : 0
              );
            }
          }
        });
        setProductResults(productRes);

        setResArray(arrayOfCategories);
        setIsLoading(false);

        if (!productRes) {
          ReactGA.event({
            category: 'Quiz Results',
            action: 'No Results Found',
          });
        }
      });
    } else {
      localStorage.setItem('quizResults', JSON.stringify(results));

      const productPromise = Promise.resolve(postQuizResults(results));
      productPromise.then((productRes) => {
        setIsLoading(false);

        setProductResults(productRes);
        const { products, categoryScores } = productRes;
        const arrayOfCategories = groupBy(products, 'category');
        categoryScores.sort((a, b) => (b.score > a.score ? 1 : -1));
        categoryScores.forEach((category) => {
          for (let i = 0; i < arrayOfCategories[category.name].length; i++) {
            if (arrayOfCategories[category.name][i].score) {
              //TODO: Add a sort for breaking tie to be price. Highest wins.
              arrayOfCategories[category.name].sort(
                (a, b) => b.score - a.score
              );
              arrayOfCategories[category.name].sort((a, b) =>
                b.score === a.score
                  ? b.productBasePrice - a.productBasePrice
                  : 0
              );
            }
          }
        });
        console.log('ARRAY', arrayOfCategories);
        setResArray(arrayOfCategories);
        if (!productRes) {
          ReactGA.event({
            category: 'Quiz Results',
            action: 'No Results Found',
          });
        }
      });
    }
  }, []);

  return (
    <React.Fragment>
      <TopContainer>
        <Disclosure>
          Affiliate Disclosure: We may receive a commission on purchases made
          through the links on this page.
        </Disclosure>
        <Link href={'https://forms.gle/sxP2CcBVmMaukWt68'} target={'_blank'}>
          Please complete this survey and give us some feedback!
        </Link>
        <Title>RESULTS</Title>

        {/* <p>{JSON.stringify(results)}</p> */}
      </TopContainer>
      {isLoading && (
        <Audio heigth="100" width="100" color="grey" ariaLabel="loading" />
      )}
      {productResults && !isLoading && (
        <ProductResult arrayOfCategories={resArray} data={productResults} />
      )}
    </React.Fragment>
  );
}
