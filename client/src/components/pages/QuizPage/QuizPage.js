import React, { useEffect, useState } from "react";
import { Wizard, Steps, Step } from "react-albus";
import QuizQuestion from "../../organisms/QuizQuestion/QuizQuestion";
import { Route } from "react-router-dom";
import { hobbyMap } from "../../../utils/hobbyMap";
import { coworkerTagMap } from "../../../utils/coworkerTagMap";

const Quiz = () => {
  const [answers, setAnswers] = useState({});
  const [isForCoworkers, setIsForCoworkers] = useState(false);
  const [isCoworker, setIsCoworker] = useState(false);

  const [isForSelf, setIsForSelf] = useState(false);
  const [quizAge, setQuizAge] = useState(0);
  const handleResponse = (id, response, isMulti) => {
    window.scrollTo(0, 0);

    if (id === "who" && response.value === "myself") {
      setIsForSelf(true);
    }
    if (id === "who") {
      localStorage.setItem("forCoworkers", false);
      setIsForCoworkers(false);
    }
    if (id === "who" && response.value === "coworker") {
      localStorage.setItem("forCoworkers", true);
      setIsForCoworkers(true);
    }

    if (id === "howMany" && response.value === "1") {
      setIsCoworker(true);
      localStorage.setItem("forCoworkers", false);

      setIsForCoworkers(false);
    }
    if (id === "age") {
      setQuizAge(response);
    }
    if (id === "price") {
      answers["age"] = "21-44";
    }
    const newInput = `${id}`;
    if (id === "who") {
      setAnswers({ who: response.value });
      return;
    }
    if (id === "additionalTags") {
      let currentTags = answers["tags"];

      currentTags.push(...response);
      setAnswers({ ...answers, tags: currentTags });
    } else {
      if (isMulti) {
        answers[newInput] = response;
      } else {
        answers[newInput] = response.value;
      }

      setAnswers(answers);
    }
  };
  const quizQuestions = [
    {
      id: "who",
      title: "Who are you shopping for?",
      questionType: ["general", "coworker"],
      answers: [
        { message: "Myself", value: "myself" },
        { message: "Coworker", value: "coworker" },
        { message: "Relative", value: "relative" },
        { message: "Friend", value: "friend" },
      ],
    },
    {
      id: "name",
      title: "What name should we use for this quiz?",
      isTextEntry: true,
      questionType: ["general"],
      answers: [],
    },
    {
      id: "howMany",
      title: "How many coworkers?",
      questionType: ["coworker"],
      answers: [
        { message: "1", value: "1" },
        { message: "2-5", value: "2-5" },
        { message: "6-20", value: "6-20" },
        { message: "20+", value: "20-10000" },
      ],
    },
    // {
    //   id: 'prefer',
    //   title: `Which do ${isForSelf ? 'you' : 'they'} prefer`,
    //   answers: [
    //     { message: 'The Great Indoors', value: 'indoor' },
    //     { message: 'The Great Outdoors', value: 'outdoor' },
    //   ],
    // },
    {
      id: "age",
      title: `How old are ${isForSelf ? "you" : "they"}?`,
      questionType: ["general"],
      answers: [
        !isCoworker && { message: "0-2", value: "0-2" },
        !isCoworker && { message: "3-5", value: "3-5" },
        !isCoworker && { message: "6-11", value: "6-11" },
        { message: "12-20", value: "12-20" },
        { message: "21-44", value: "21-44" },
        { message: "45-65", value: "45-65" },
        { message: "65+", value: "65-100" },
      ],
    },
    {
      id: "occasion",
      title: "What is the Occasion?",
      questionType: ["general", "coworker"],
      answers: [
        { message: "Anniversary", value: "anniversary" },
        { message: "Birthday", value: "birthday" },
        { message: "Holiday", value: "holiday" },
        { message: "White Elephant", value: "whiteElephant" },
        { message: "Who Needs An Occasion?", value: "any" },
      ],
      // hasAdditionalField: 'date',
    },
    {
      id: "hobbies",
      title: "What about hobbies?",
      questionType: ["general"],
      isMulti: true,
      answers: hobbyMap,
    },
    {
      id: "type",
      title: "You're looking for items that are: ",
      questionType: ["general"],
      isMulti: true,
      answers: [
        { message: "Essential", value: "essentials" },
        { message: "Interesting and Fun", value: "interestingAndFun" },
        { message: "Thoughtful", value: "thoughtful" },
      ],
    },
    {
      id: "tags",
      title: `Describe ${isForSelf ? "your" : "their"} personality`,
      isMulti: true,
      questionType: ["general"],
      answers: [
        { message: "Artsy", value: "artsy" },
        { message: "Creative", value: "creative" },
        { message: "Quirky", value: "quirky" },
        { message: "Practical", value: "practical" },
        { message: "Organized", value: "organized" },
        { message: "Efficient", value: "efficient" },
        { message: "Athletic", value: "athletic" },
        { message: "Competitive", value: "competitive" },
        { message: "Handy", value: "handy" },
        { message: "Eco-Friendly", value: "eco-friendly" },
        { message: "Classy", value: "classy" },
        { message: "Nerdy", value: "nerdy" },
        { message: "Trendy", value: "trendy" },
      ],
    },
    {
      id: "coworkerTags",
      title: `Gifts that are:`,
      isMulti: true,
      questionType: ["coworker"],
      answers: coworkerTagMap,
    },
    {
      id: "additionalTags",
      title: `What are ${isForSelf ? "your" : "their"} interests?`,
      isMulti: true,
      questionType: ["general"],
      answers: [
        { message: "Indoors", value: "indoors" },
        { message: "Outdoors", value: "outdoors" },
        { message: "Travel", value: "travel" },
        { message: "Coffee", value: "coffee" },
        { message: "Tea", value: "tea" },
        { message: "Alcohol", value: "alcohol" },
        { message: "Bath & Body", value: "bathAndBody" },
        { message: "Home Decor", value: "homeDecor" },
        { message: "Home Office", value: "homeOffice" },
        { message: "Cats", value: "cats" },
        { message: "Dogs", value: "dogs" },
        { message: "Books", value: "books" },
        { message: "Music", value: "music" },
        { message: "Technology", value: "technology" },
      ],
    },
    {
      id: "price",
      title: "Price Range per Gift?",
      questionType: ["coworker"],
      answers: [
        { message: "$0-$10", value: "0-10" },
        { message: "$10-$30", value: "10-30" },
        { message: "$30-$50", value: "30-50" },
        { message: "$50+", value: "50-999999" },
      ],
    },
    // {
    //   id: 'createAccount',
    //   title: 'Do you want to create an account?',
    //   answers: [
    //     { message: 'Yes', value: true },
    //     { message: 'Not at this time', value: false },
    //   ],
    // },
    //   {
    //     id: 'results',
    //     title: '',
    //     answers: [''],
    //   },
    // ];
    {
      id: "results",
      questionType: ["general", "coworker"],
      title: "",
      answers: [""],
    },
  ];
  if (isForCoworkers) {
  }

  return (
    <Route
      render={({ history }) => (
        <Wizard history={history}>
          <Steps>
            {quizQuestions.map((quizData) => (
              <Step
                key={quizData.id}
                id={`quiz/${quizData.id}`}
                render={({ next }) => (
                  <QuizQuestion
                    quizAge={quizAge}
                    isForCoworkers={isForCoworkers}
                    handleResponse={handleResponse}
                    next={next}
                    questionType={quizData.questionType}
                    id={quizData.id}
                    title={quizData.title}
                    answers={quizData.answers}
                    isSlider={quizData.isSlider || false}
                    isText={quizData?.isTextEntry || false}
                    isMulti={quizData.isMulti || false}
                    results={answers}
                    hasAdditionalField={quizData.hasAdditionalField}
                  />
                )}
              />
            ))}
          </Steps>
        </Wizard>
      )}
    />
  );
};

export default Quiz;
