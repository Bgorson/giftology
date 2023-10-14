import React, { useState, useContext } from "react";
import { Audio } from "react-loader-spinner";
import { postGPT } from "../../../api/gpt";
import {v4} from 'uuid';
import { postAllQuizResults } from "../../../api/allQuiz";
import {
  Disclosure,
  TopContainer,
  Title,
  ResultInfo,
  LoaderContainer,
} from "./styles";
import ProductResult from "../../organisms/ProductResult/ProductResult";
import ReactGA from "react-ga4";
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
      let storedQuizID= localStorage.getItem("quizId");
      if (storedQuizID ==='undefined'|| storedQuizID ==='null'){
        localStorage.setItem("quizId", '');
        storedQuizID = null;
      }
      
      const productPromise = Promise.resolve(
        postAllQuizResults(JSON.parse(storedResults), email || storedEmail,localStorage.getItem("quizId")||'')
      );
      productPromise.then((productRes) => {
        setProductResults(productRes);
        setQuizData(productRes.quizData);
        localStorage.setItem("quizId", productRes.quizData?.id);

        setIsLoading(false);

        if (!productRes) {
          ReactGA.event({
            category: "Quiz Results",
            action: "No Results Found",
          });
        }
      });
    } else {
      localStorage.setItem("quizId", '');
      localStorage.setItem("quizResults", JSON.stringify(results));
      let storedEmail = localStorage.getItem("userEmail");

      const productPromise = Promise.resolve(
        postAllQuizResults(results, email || storedEmail,localStorage.getItem("quizId")||v4() )
      );
      productPromise.then((productRes) => {
        setProductResults(productRes);
        if (productRes.quizData){
          setQuizData(productRes.quizData);
          localStorage.setItem("quizId", productRes.quizData?.id);
        }


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
    let quizAnswers;
    if (Object.keys(results).length !== 0) {
      quizAnswers = results;
    } else {
      quizAnswers = JSON.parse(localStorage.getItem("quizResults")) || {};
    }

    postGPT(quizAnswers).then((res) => {
      setChatGPTProducts(res);
    });
  }, []);

  let formattedTags = quizData?.quizResults
    ? [...quizData.quizResults.tags]
    : results?.tags
    ? [...results.tags]
    : [];
  formattedTags.forEach((tag, index) => {
    if (tag === "healthNut") {
      formattedTags[index] = "Health Nut";
    } else if (tag === "MustOwn") {
      formattedTags[index] = "Must Own";
    } else if (tag === "boardGames") {
      formattedTags[index] = "Board Games";
    } else if (tag === "bathAndBody") {
      formattedTags[index] = " Bath And Body";
    } else if (tag === "justForFun") {
      formattedTags[index] = " Just For Fun";
    } else if (tag === "artsAndCrafts") {
      formattedTags[index] = " Arts And Crafts";
    } else if (tag === "samplerkits") {
      formattedTags[index] = " Sampler Kits";
    } else {
      formattedTags[index] = " " + tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  });
  let formattedHobbies = quizData?.quizResults
    ? [...quizData.quizResults.hobbies]
    : results?.hobbies
    ? [...results.hobbies]
    : [];
  formattedHobbies.forEach((hobby, index) => {
    if (hobby === "artsAndCrafts") {
      formattedHobbies[index] = "Arts And Crafts";
    } else if (hobby === "healthAndWellness") {
      formattedHobbies[index] = "Health And Wellness";
    } else if (hobby === "boardGames") {
      formattedHobbies[index] = "Board Games";
    } else if (hobby === "mixology") {
      formattedHobbies[index] = "Home Chef/Cooking";
    } else if (hobby === "homeChef") {
      formattedHobbies[index] = "Mixology/Alcohol";
    }
  });

  console.log("Clean hobbiets", formattedHobbies);

  return (
    <React.Fragment>
      <TopContainer>
        <Title>Results</Title>
        {/* {quizData && <ResultInfo>
        {`Here are gift suggestions for ${(quizData.quizResults.gender=== 'male' || quizData.quizResults.gender=== 'female')  ? 'a ' + quizData.quizResults.gender:'someone' } aged ${quizData.quizResults.age} who enjoys ${formattedHobbies.join(',')}, and has interests in the following topics: ${formattedTags.join(',')}. Be sure to add items to your wishlist, and create a profile so you can visit again and again!`}
        </ResultInfo>}
        {results && !quizData && <ResultInfo>
        {`Here are gift suggestions for ${(results.gender=== 'male' || results.gender=== 'female')  ? 'a ' + results.gender:'someone' } aged ${results.age} who enjoys ${formattedHobbies.join(',')}, and has interests in the following topics: ${formattedTags.join(',')}. Be sure to add items to your wishlist, and create a profile so you can visit again and again!`}
        </ResultInfo>}*/}
        <Disclosure>
          Affiliate Disclosure: We may receive a commission on purchases made
          through the links on this page.
        </Disclosure>
        {/* <Link href={'https://forms.gle/sxP2CcBVmMaukWt68'} target={'_blank'}>
          Please complete this survey and give us some feedback!
        </Link> */}
        {/* <Title>RESULTS</Title> */}
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
