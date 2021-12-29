import React, { useState, Fragment } from 'react';

import AgeSlider from '../../atoms/Slider/AgeSlider';
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
  const {
    title,
    answers,
    isSlider,
    handleResponse,
    next,
    id,
    results,
    isMulti,
    hasAdditionalField,
  } = props;
  const [checkedState, setCheckedState] = useState(
    new Array(answers.length).fill(false)
  );
  const [age, setAge] = useState(30);
  const [date, setDate] = useState('');
  const [additionalMainAnswer, setAdditionalMainAnswer] = useState('');
  const [showAdditionalField, setShowAdditionalField] = useState(false);

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

  const possibleAnswers = answers.map((answers, index) => (
    <FancyButton
      type={showAdditionalField ? 'checkbox' : 'submit'}
      onClick={(e) => handleOnChange(index, e)}
      checked={
        showAdditionalField
          ? additionalMainAnswer.value === answers.value
          : checkedState[index]
      }
      onClick={() => {
        if (
          hasAdditionalField &&
          (answers.value === 'anniversary' || answers.value === 'birthday')
        ) {
          handleAdditionalData(answers);
        } else {
          handleResponse(id, answers);

          next();
        }
      }}
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
      {showAdditionalField && (
        <Fragment>
          <input onChange={(e) => setDate(e.target.value)} type="date" />
          <ButtonContainer>
            <FancyButton
              type="submit"
              onClick={() => {
                handleResponse(id, additionalMainAnswer);
                handleResponse('date', date, true);
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
