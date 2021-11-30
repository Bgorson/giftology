import React, { useState } from "react";

import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import QuizResult from "../QuizResult/QuizResult";

import {
  ButtonContainer,
  FancyButton,
  FancyText,
  FancyLabel,
  FancyDesign,
  FancyRadioButton,
} from "./styles.js";

export default function QuizQuestion(props) {
  const { title, answers, handleResponse, next, id, results, isMulti } = props;
  const [checkedState, setCheckedState] = useState(
    new Array(answers.length).fill(false)
  );

  const handleOnChange = (position) => {
    console.log(position);
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
      <FancyLabel>
        <FancyRadioButton
          type="checkbox"
          id={`custom-checkbox-${index}`}
          name={answers.message}
          value={answers.message}
          checked={checkedState[index]}
          onChange={() => handleOnChange(index)}
        />
        <FancyDesign checked={checkedState[index]} />
        <FancyText> {answers.message}</FancyText>
      </FancyLabel>
    </div>
  ));

  return id !== "results" ? (
    <Container>
      <Title>{title}</Title>
      <ButtonContainer>
        {isMulti ? multiPossibleAnswers : possibleAnswers}
      </ButtonContainer>
      {isMulti ? (
        <FancyButton
          type="submit"
          onClick={() => {
            handleMultiResponse(id, answers, checkedState);
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
