import React, { useState, Fragment, useEffect } from "react";
import DatePicker from "react-datepicker";
import AgeSlider from "../../atoms/Slider/AgeSlider";
import QuizResult from "../QuizResult/QuizResult";
import ReactGA from "react-ga4";
import "react-datepicker/dist/react-datepicker.css";

import {
  Container,
  ButtonContainer,
  FancyButton,
  Title,
  InputName,
  ProgressBar,
  QuizHeader,
  Progress,
  ProgressFill,
  DateContainer,
} from "./styles.js";

export default function QuizQuestion(props) {
  const {
    quizAge,
    title,
    isSlider,
    handleResponse,
    next,
    id,
    results,
    isMulti,
    hasAdditionalField,
    isForCoworkers,
    questionType,
    isText,
    totalStepNumber,
    currentStepNumber,
    quizData,
  } = props;
  let { answers } = props;
  const [checkedState, setCheckedState] = useState(
    new Array(answers.length).fill(false)
  );
  const [text, setText] = useState("");
  const dateFormat = "MM/dd";
  useEffect(() => {
    if (id !== "results" && localStorage.getItem("preSelect")) {
      const prefilled = JSON.parse(localStorage.getItem("preSelect")) || {};
      if (prefilled) {
        const preSelected = prefilled[id];
        if (preSelected) {
          if (isMulti) {
            const updatedCheckedState = checkedState.map((item, index) =>
              preSelected.includes(answers[index]?.value) ? true : item
            );
            setCheckedState(updatedCheckedState);
          } else {
            const updatedCheckedState = checkedState.map((item, index) =>
              preSelected === answers[index]?.value ? true : item
            );
            setCheckedState(updatedCheckedState);
          }
        }
      }
    }
    // Skip questions that are not relevant to the user

    if (
      ((localStorage.getItem("forCoworkers") === "true" || isForCoworkers) &&
        !questionType.includes("coworker") &&
        id !== "results" &&
        id == "gender") ||
      ((localStorage.getItem("forCoworkers") === "false" || !isForCoworkers) &&
        questionType.includes("coworker") &&
        questionType.length === 1)
    ) {
      next();
    }
  }, []);
  const [age, setAge] = useState(30);
  const [date, setDate] = useState("");
  const [placeholder, setPlaceholder] = useState("MM/DD/YYYY");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [additionalMainAnswer, setAdditionalMainAnswer] = useState("");
  const [showAdditionalField, setShowAdditionalField] = useState(false);
  const handleAgeValue = (e) => {
    setAge(e);
  };
  const handleText = (e) => {
    setText(e.target.value);
  };
  const handleSliderResponse = (id, age) => {
    handleResponse(id, { value: `${age}-${age}` });
  };
  const handleNameResponse = (id, name) => {
    handleResponse(id, { value: name });
  };

  const handleOnChange = (position, e) => {
    e.preventDefault();
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };
  const handleAdditionalData = (answers) => {
    setAdditionalMainAnswer(answers);
    // turn selected answer grey
    setShowAdditionalField(true);
  };
  const handleMultiResponse = (
    id,
    arrayOfPossbleAnswers,
    arrayofCheckedResponses
  ) => {
    const response = [];
    arrayofCheckedResponses.forEach((checkedBox, index) => {
      if (checkedBox) {
        response.push(arrayOfPossbleAnswers[index].value);
      }
    });
    handleResponse(id, response, true);
  };
  if (parseInt(quizAge?.value?.split("-")[0]) < 21 && id === "hobbies") {
    answers = answers.filter(function (el) {
      return el.value != "mixology";
    });
  }
  const possibleAnswers = answers.map(
    (answers, index) =>
      answers && (
        <FancyButton
          type={showAdditionalField ? "checkbox" : "submit"}
          checked={
            showAdditionalField
              ? additionalMainAnswer.value === answers.value
              : checkedState[index]
          }
          onClick={(e) => {
            handleOnChange(index, e);
            ReactGA.event({
              category: "Quiz",
              action: `Clicked ${answers.message}`,
              label: "QuizButton",
              value: answers.message,
            });
            if (
              hasAdditionalField &&
              (answers.value === "anniversary" || answers.value === "birthday")
            ) {
              setSelectedAnswer(answers.value);
              handleAdditionalData(answers);
            } else {
              if (id === "createAccount" && answers.message === "Yes") {
                // let widget = window.cloudinary.createUploadWidget(
                //   {
                //     cloudName: "deruncuzv",
                //     uploadPreset: "jedjicbi",
                //   },
                //   (error, result) => {
                //     if (!error && result && result.event === "success") {
                //       console.log(result.info.url);
                //       handleResponse(id, result.info.url, true);
                //       next();
                //     }
                //   }
                // );
                // widget.open();
                const arrayOfImages = [
                  "https://res.cloudinary.com/deruncuzv/image/upload/v1679963321/Use_for_default_profile_image1_etrene.jpg",
                  "https://res.cloudinary.com/deruncuzv/image/upload/v1679963313/Use_for_default_profile_image2_mhtngy.jpg",
                  "https://res.cloudinary.com/deruncuzv/image/upload/v1679963312/Use_for_default_profile_image3_va1l7l.jpg",
                ];
                let randomImage = arrayOfImages[Math.floor(Math.random() * 6)];
                handleResponse(id, randomImage, true);
                next();
              } else {
                handleResponse(id, answers);
                next();
              }
            }
          }}
          key={answers.value}
        >
          {answers.message}
        </FancyButton>
      )
  );

  const multiPossibleAnswers = answers.map((answers, index) => (
    <div key={answers.message}>
      <FancyButton
        customBackground={checkedState[index] ? true : false}
        type="checkbox"
        id={`custom-checkbox-${index}`}
        value={answers.message}
        checked={checkedState[index]}
        onClick={(e) => {
          ReactGA.event({
            category: "Quiz",
            action: `Clicked ${answers.message}`,
            label: "QuizButton",
            value: answers.message,
          });
          handleOnChange(index, e);
        }}
      >
        {answers.message}
      </FancyButton>
    </div>
  ));

  return id !== "results" ? (
    <>
      <QuizHeader>
        <ProgressBar>
          {`Question ${currentStepNumber} of ${totalStepNumber}`}
          <Progress>
            <ProgressFill
              fillPercent={
                (parseInt(currentStepNumber) / parseInt(totalStepNumber)) * 100
              }
            />
          </Progress>
        </ProgressBar>
      </QuizHeader>
      <Container>
        {title && <Title>{title}</Title>}
        {isSlider && <AgeSlider handleAgeValue={handleAgeValue} />}
        {isText && <InputName onChange={handleText} />}
        <ButtonContainer>
          {isMulti ? multiPossibleAnswers : possibleAnswers}
        </ButtonContainer>
        {isMulti ? (
          <FancyButton
            isSubmit={true}
            isMulti={isMulti}
            type="submit"
            onClick={() => {
              ReactGA.event({
                category: "Quiz",
                action: `Clicked Multi Submit ${id}`,
                label: "QuizButton",
                value: answers.message,
              });
              handleMultiResponse(id, answers, checkedState);
              next();
            }}
          >
            Submit
          </FancyButton>
        ) : null}
        {showAdditionalField && (
          <Fragment>
            <DateContainer>
              <p>{`Whats the ${selectedAnswer} date this year?`}</p>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                showMonthDropdown
                placeholderText="Select Date"
                dateFormat={dateFormat}
              />
            </DateContainer>

            {/* 
            <DateInput
              placeholder={placeholder}
              onChange={(e) => {
                setPlaceholder(e.target.value);
                setDate(e.target.value);
              }}
              
              type="date"
            /> */}
            <ButtonContainer>
              <FancyButton
                isSubmit={true}
                type="submit"
                onClick={() => {
                  ReactGA.event({
                    category: "Quiz",
                    action: `Clicked Multi Submit ${id}`,
                    label: "QuizButton",
                    value: answers.message,
                  });
                  handleResponse(id, additionalMainAnswer);
                  handleResponse("date", date, true);
                  next();
                }}
              >
                Submit
              </FancyButton>
            </ButtonContainer>
          </Fragment>
        )}
        {isSlider ? (
          <FancyButton
            isSubmit={true}
            isSlider={isSlider}
            isMulti={isMulti}
            type="submit"
            onClick={() => {
              ReactGA.event({
                category: "Quiz",
                action: `Clicked Age ${age}`,
                label: "QuizButton",
                value: age,
              });
              handleSliderResponse(id, age);
              next();
            }}
          >
            Submit
          </FancyButton>
        ) : null}
        {isText ? (
          <FancyButton
            isSubmit={true}
            isText={isText}
            type="submit"
            onClick={() => {
              ReactGA.event({
                category: "Quiz",
                action: `Entered Name`,
                label: "QuizButton",
                value: text,
              });
              handleNameResponse(id, text);
              next();
            }}
          >
            Submit
          </FancyButton>
        ) : null}
      </Container>
    </>
  ) : (
    <QuizResult results={results} />
  );
}
