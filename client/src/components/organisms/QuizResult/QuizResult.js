import React, { useState, useContext } from "react";
import { Audio } from "react-loader-spinner";

// import { postQuizResults } from '../../../api/quiz';
import { postAllQuizResults } from "../../../api/allQuiz";
import { Disclosure, TopContainer, Title, LoaderContainer } from "./styles";
import ProductResult from "../../organisms/ProductResult/ProductResult";
import ReactGA from "react-ga";
import { UserContext } from "../../../context/UserContext";

export default function QuizResult(props) {
  // console.log(props);
  const { results } = props;
  const [isLoading, setIsLoading] = useState(true);
  const { token, email } = useContext(UserContext);

  const [resArray, setResArray] = useState([]);

  function groupBy(arr, property) {
    return arr.reduce((memo, x) => {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }
  React.useEffect(() => {
    ReactGA.event({
      category: "Quiz Results",
      action: "Finished Quiz",
    });
  }, []);

  const [productResults, setProductResults] = React.useState(null);
  const [quizData, setQuizData] = React.useState(null);

  React.useEffect(() => {
    if (Object.keys(results).length === 0) {
      const storedResults = localStorage.getItem("quizResults");
      let storedEmail = localStorage.getItem("userEmail");
      console.log("from ls", storedEmail);
      const productPromise = Promise.resolve(
        postAllQuizResults(JSON.parse(storedResults), email || storedEmail)
      );
      productPromise.then((productRes) => {
        // console.log(productRes);

        // const { products, categoryScores } = productRes;

        // const arrayOfCategories = groupBy(products, 'category');

        // categoryScores.sort((a, b) => (b.score > a.score ? 1 : -1));
        // categoryScores.forEach((category) => {
        //   for (let i = 0; i < arrayOfCategories[category.name].length; i++) {
        //     if (arrayOfCategories[category.name][i].score) {
        //       //TODO: Add a sort for breaking tie to be price. Highest wins.
        //       arrayOfCategories[category.name].sort(
        //         (a, b) => b.score - a.score
        //       );
        //       arrayOfCategories[category.name].sort(
        //         (a, b) =>
        //           parseInt(a.productBasePrice) - parseInt(b.productBasePrice)
        //       );
        //     }
        //   }
        // });

        // setResArray(arrayOfCategories);
        setProductResults(productRes);
        setQuizData(productRes.quizData);

        setIsLoading(false);

        if (!productRes) {
          ReactGA.event({
            category: "Quiz Results",
            action: "No Results Found",
          });
        }
      });
    } else {
      localStorage.setItem("quizResults", JSON.stringify(results));
      let storedEmail = localStorage.getItem("userEmail");

      const productPromise = Promise.resolve(
        postAllQuizResults(results, email || storedEmail)
      );
      productPromise.then((productRes) => {
        setProductResults(productRes);
        setQuizData(productRes.quizId);

        // console.log(productRes);

        // const { products, categoryScores } = productRes;
        // const arrayOfCategories = groupBy(products, 'category');
        // categoryScores.sort((a, b) => (b.score > a.score ? 1 : -1));
        // categoryScores.forEach((category) => {
        //   for (let i = 0; i < arrayOfCategories[category.name].length; i++) {
        //     if (arrayOfCategories[category.name][i].score) {
        //       //TODO: Add a sort for breaking tie to be price. Highest wins.
        //       arrayOfCategories[category.name].sort(
        //         (a, b) => b.score - a.score
        //       );
        //       arrayOfCategories[category.name].sort((a, b) =>
        //         b.score === a.score
        //           ? b.productBasePrice - a.productBasePrice
        //           : 0
        //       );
        //     }
        //   }
        // });
        // setResArray(arrayOfCategories);
        setIsLoading(false);

        if (!productRes) {
          ReactGA.event({
            category: "Quiz Results",
            action: "No Results Found",
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
        {/* <Link href={'https://forms.gle/sxP2CcBVmMaukWt68'} target={'_blank'}>
          Please complete this survey and give us some feedback!
        </Link> */}
        <Title>RESULTS</Title>

        {/* <p>{JSON.stringify(results)}</p> */}
      </TopContainer>
      {isLoading && (
        <LoaderContainer>
          Calculating the perfect gift...
          <Audio heigth="500" width="500" color="grey" ariaLabel="loading" />
        </LoaderContainer>
      )}
      {!isLoading && (
        // <ProductResult arrayOfCategories={resArray} data={productResults} />
        <ProductResult
          quizData={quizData}
          results={results}
          data={productResults}
        />
      )}
    </React.Fragment>
  );
}
