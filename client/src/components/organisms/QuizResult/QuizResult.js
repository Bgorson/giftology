import React, { useState, useContext } from "react";
import { Audio } from "react-loader-spinner";
import { postGPT } from "../../../api/gpt";

import { postAllQuizResults } from "../../../api/allQuiz";
import { Disclosure, TopContainer, Title, LoaderContainer } from "./styles";
import ProductResult from "../../organisms/ProductResult/ProductResult";
import ReactGA from "react-ga";
import { UserContext } from "../../../context/UserContext";
import { useEffect } from "react";

export default function QuizResult(props) {
  const { results } = props;
  const [isLoading, setIsLoading] = useState(true);
  const { email } = useContext(UserContext);

  React.useEffect(() => {
    ReactGA.event({
      category: "Quiz Results",
      action: "Finished Quiz",
    });
    localStorage.setItem("preSelect", "");
  }, []);

  const [productResults, setProductResults] = React.useState(null);
  const [quizData, setQuizData] = React.useState(null);
  const [chatGPTProducts, setChatGPTProducts] = React.useState(null);
  React.useEffect(() => {
    if (Object.keys(results).length === 0) {
      const storedResults = localStorage.getItem("quizResults");
      let storedEmail = localStorage.getItem("userEmail");
      const productPromise = Promise.resolve(
        postAllQuizResults(JSON.parse(storedResults), email || storedEmail)
      );
      productPromise.then((productRes) => {
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

  useEffect(() => {
    const storedResults = localStorage.getItem("quizResults");
    let quizAnswers = JSON.parse(storedResults) || results;
    postGPT(quizAnswers).then((res) => {
      setChatGPTProducts(res);
    });
  }, [quizData]);
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
      </TopContainer>
      {isLoading && (
        <LoaderContainer>
          Calculating the perfect gift...
          <Audio heigth="500" width="500" color="grey" ariaLabel="loading" />
        </LoaderContainer>
      )}
      {!isLoading && (
        <ProductResult
          quizData={quizData}
          results={results}
          data={productResults}
          chatGPTResponses={chatGPTProducts}
        />
      )}
    </React.Fragment>
  );
}
