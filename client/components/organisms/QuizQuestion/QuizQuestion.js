import React, { useState } from "react";

import AgeSlider from "../../atoms/Slider/AgeSlider";
import QuizResult from "../QuizResult/QuizResult";

import {
  Container,
  ButtonContainer,
  FancyButton,
  FancyText,
  FancyLabel,
  FancyDesign,
  FancyRadioButton,
  Title,
} from "./styles.js";

export default function QuizQuestion(props) {
  const {
    title,
    answers,
    isSlider,
    handleResponse,
    next,
    id,
    results,
    isMulti,
  } = props;
  const [checkedState, setCheckedState] = useState(
    new Array(answers.length).fill(false)
  );
  const [age, setAge] = useState(12);
  const handleAgeValue = (e) => {
    setAge(e);
  };
  const handleSliderResponse = (id, age) => {
    handleResponse(id, { value: `${age}-${age}` });
  };

  const handleOnChange = (position, e) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
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

  const possibleAnswers = answers.map((answers) => (
    <FancyButton
      onClick={() => {
        handleResponse(id, answers);
        next();
      }}
      type="submit"
      key={answers.value}
    >
      {answers.message}
    </FancyButton>
  ));

  const multiPossibleAnswers = answers.map((answers, index) => (
    <div key={answers.message}>
      <FancyButton
        type="checkbox"
        id={`custom-checkbox-${index}`}
        value={answers.message}
        checked={checkedState[index]}
        onClick={(e) => handleOnChange(index, e)}
      >
        {answers.message}
      </FancyButton>
    </div>
  ));

  return id !== "results" ? (
    <Container>
      {title && <Title>{title}</Title>}
      {isSlider && <AgeSlider handleAgeValue={handleAgeValue} />}

      <ButtonContainer>
        {isMulti ? multiPossibleAnswers : possibleAnswers}
      </ButtonContainer>
      {isMulti ? (
        <FancyButton
          isMulti={isMulti}
          type="submit"
          onClick={() => {
            handleMultiResponse(id, answers, checkedState);
            next();
          }}
        >
          Submit
        </FancyButton>
      ) : null}
      {isSlider ? (
        <FancyButton
          isSlider={isSlider}
          isMulti={isMulti}
          type="submit"
          onClick={() => {
            handleSliderResponse(id, age);
            next();
          }}
        >
          Submit
        </FancyButton>
      ) : null}
    </Container>
  ) : (
    <QuizResult results={results} />
  );
}
