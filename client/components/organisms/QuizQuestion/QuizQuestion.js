import React, { useState } from 'react';

import Section from 'react-bulma-companion/lib/Section';
import QuizResult from '../QuizResult/QuizResult';

import {
  Container,
  ButtonContainer,
  FancyButton,
  FancyText,
  FancyLabel,
  FancyDesign,
  FancyRadioButton,
  Title,
} from './styles.js';

export default function QuizQuestion(props) {
  const { title, answers, handleResponse, next, id, results, isMulti } = props;
  const [checkedState, setCheckedState] = useState(
    new Array(answers.length).fill(false),
  );

  console.log(answers);
  const handleOnChange = (position, e) => {
    console.log(e.target.value);
    console.log(position);
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item,
    );
    setCheckedState(updatedCheckedState);
  };
  const handleMultiResponse = (
    id,
    arrayOfPossbleAnswers,
    arrayofCheckedResponses,
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

  return id !== 'results' ? (
    <Container>
      {title && <Title>{title}</Title>}
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
    </Container>
  ) : (
    <QuizResult results={results} />
  );
}
