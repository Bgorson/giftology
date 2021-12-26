import React from 'react';
import { Wizard, Steps, Step } from 'react-albus';
import { Container } from './styles';
import QuizQuestion from '../../organisms/QuizQuestion/QuizQuestion';

const Quiz = () => {
  const [answers, setAnswers] = React.useState({});
  const [isForSelf, setIsForSelf] = React.useState(false);

  const handleResponse = (id, response, isMulti) => {
    if (id === 'who' && response === 'Myself') {
      setIsForSelf(true);
    }
    const newInput = `${id}`;
    if (isMulti) {
      answers[newInput] = response;
    } else {
      answers[newInput] = response.value;
    }

    setAnswers(answers);
    console.log('res', answers);
  };

  const quizQuestions = [
    {
      id: 'who',
      title: 'Who are you shopping for?',
      answers: [
        { message: 'Myself', value: 'myself' },
        { message: 'A Relative', value: 'relative' },
        { message: 'A Friend', value: 'friend' },
      ],
    },
    {
      id: 'prefer',
      title: `Which do ${isForSelf ? 'you' : 'they'} prefer`,
      answers: [
        { message: 'The Great indoors', value: 'indoor' },
        { message: 'The Great Outdoors', value: 'outdoor' },
      ],
    },
    {
      id: 'age',
      title: `How old are ${isForSelf ? 'you' : 'they'}?`,
      answers: [],
      isSlider: true,
    },
    {
      id: 'occassion',
      title: 'What is the occassion?',
      answers: [
        { message: 'Anniversary', value: 'anniversary' },
        { message: 'Birthday', value: 'birthday' },
        { message: 'Holiday', value: 'holiday' },
        { message: 'White Elephant', value: 'whiteElephant' },
        { message: 'Who Need an occasion?', value: 'any' },
      ],
      hasAdditionalField: 'date',
    },
    {
      id: 'hobbies',
      title: 'What about hobbies?',
      isMulti: true,
      answers: [
        { message: 'Camping', value: 'camping' },
        { message: 'Health & Wellness', value: 'health' },
        { message: 'Home Chef/Cooking', value: 'homeChef' },
        { message: 'Mixology/Alcohol', value: 'mixology' },
        { message: 'Music', value: 'music' },
        { message: 'Reading', value: 'reading' },
        { message: 'Technology', value: 'technology' },
        { message: 'Other', value: 'other' },
      ],
    },
    {
      id: 'type',
      title: '"You\'re looking for items that are:": ',
      answers: [
        { message: 'Essential', value: 'essentials' },
        { message: 'Interesting and Fun', value: 'interestingAndFun' },
      ],
    },
    {
      id: 'price',
      title: 'Price Range?',
      answers: [
        { message: '<$50', value: '0-50' },
        { message: '<$100', value: '0-100' },
        { message: '<$200', value: '0-200' },
        { message: '+$200', value: '200-999999' },
      ],
    },
    {
      id: 'createAccount',
      title: 'Do you want to create an account?',
      answers: [
        { message: 'Yes', value: true },
        { message: 'Not at this time', value: false },
      ],
    },
    {
      id: 'results',
      title: '',
      answers: [''],
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
                  isSlider={quizData.isSlider || false}
                  isMulti={quizData.isMulti || false}
                  results={answers}
                  hasAdditionalField={quizData.hasAdditionalField}
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
