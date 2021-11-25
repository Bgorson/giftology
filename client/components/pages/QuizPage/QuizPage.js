import React, { useState } from "react";
import { Wizard, Steps, Step } from "react-albus";
import { Container } from "./styles";
import QuizQuestion from "../../organisms/QuizQuestion/QuizQuestion";
import { getProducts } from "../../../api/products";

const Quiz = () => {
  const [answers, setAnswers] = React.useState({});
  const [isForSelf, setIsForSelf] = React.useState(false);

  const handleResponse = (id, response, isMulti) => {
    console.log(isMulti)
    if (id === "who" && response === "Myself") {
      setIsForSelf(true);
    }
    const newInput = `${id}`;
    if (isMulti) {
      console.log(newInput)
      console.log(response)

      answers[newInput] = response;
    } else {
      answers[newInput] = response.value;
    }

    setAnswers(answers);
    console.log(answers);
  };

  const quizQuestions = [
    {
      id: "who",
      title: "Who are you shopping for?",
      answers: [
        { message: "Myself", value: "myself" },
        { message: "A Relative", value: "relative" },
        { message: "A Friend", value: "friend" },
      ],
    },
    {
      id: "prefer",
      title: `Which do ${isForSelf ? "you" : "they"} prefer`,
      answers: [
        { message: "The Great indoors", value: "indoor" },
        { message: "The Great Outdoors", value: "outdoor" },
      ],
    },
    {
      id: "age",
      title: `How old are ${isForSelf ? "you" : "they"}?`,
      answers: [
        { message: "1-2", value: "1-2" },
        { message: "3-4", value: "3-4" },
        { message: "5-6", value: "5-6" },
        { message: "7-10", value: "7-10" },
        { message: "11-15", value: "11-15" },
        { message: "16-20", value: "16-20" },
        { message: "21-30", value: "21-30" },
        { message: "31-40", value: "31-40" },
        { message: "41-50", value: "41-50" },
        { message: ">50", value: "51-99999" },
      ],
    },
    {
      id: "occassion",
      title: "What is the occassion?",
      answers: [
        { message: "Anniversary", value: "anniversary" },
        { message: "Birthday", value: "birthday" },
        { message: "Holiday", value: "holiday" },
        { message: "White Elephant", value: "whiteElephant" },
        { message: "Who Need an occasion?", value: "any" },
      ],
    },
    {
      id: "type",
      title: `Are ${isForSelf ? "you" : "they"} more: `,
      answers: [
        { message: "Practical", value: "practical" },
        { message: "Whimsical", value: "whimsical" },
      ],
    },
    {
      id: "hobbies",
      title: "What about hobbies?",
      isMulti: true,
      answers: [
        { message: "Camping", value: "camping" },
        { message: "Health & Wellness", value: "health" },
        { message: "Home Chef/Cooking", value: "cooking" },
        { message: "Mixology/Alcohol", value: "mixology" },
        { message: "Music", value: "music" },
        { message: "Reading", value: "reading" },
        { message: "Technology", value: "technology" },
        { message: "Other", value: "other" },
      ],
    },
    {
      id: "price",
      title: "Price Range?",
      answers: [
        { message: "<$50", value: "0-50" },
        { message: "<$100", value: "0-100" },
        { message: "<$200", value: "0-200" },
        { message: "+$200", value: "200-999999" },
      ],
    },
    {
      id: "createAccount",
      title: "Do you want to create an account?",
      answers: [
        { message: "Yes", value: true },
        { message: "Not at this time", value: false },
      ],
    },
    {
      id: "results",
      title: "",
      answers: [""],
    },
  ];

  return (
    <Container>
      <Wizard>
        <Steps>
          {quizQuestions.map((quizData) => (
            <Step
              key={quizData.id}
              id={quizData.id}
              render={({ next }) => (
                <QuizQuestion
                  handleResponse={handleResponse}
                  next={next}
                  id={quizData.id}
                  title={quizData.title}
                  answers={quizData.answers}
                  isMulti={quizData.isMulti || false}
                  results={answers}
                />
              )}
            />
          ))}
        </Steps>
      </Wizard>
    </Container>
  );
};

export default Quiz;
