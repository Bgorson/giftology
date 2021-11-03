import React, { useState } from 'react';
import { Wizard, Steps, Step } from 'react-albus';
import { Container } from './styles';
import QuizQuestion from '../../organisms/QuizQuestion/QuizQuestion';
import { getProducts } from '../../../api/products';

const Quiz = () => {
  const answers = [];
  const [isForSelf, setIsForSelf] = React.useState(false);

  const handleResponse = (id, response) => {
    if (id === 'who' && response === 'Myself') {
      setIsForSelf(true);
    }
    answers.push({ [id]: response });
  };

  const quizQuestions = [
    {
      id: 'who',
      title: 'Who are you shopping for?',
      answers: ['Myself', 'A Relative', 'A Friend'],
    },
    {
      id: 'prefer',
      title: `Which do ${isForSelf ? 'you' : 'they'} prefer`,
      answers: ['The Great indoors', 'The Great Outdoors'],
    },
    {
      id: 'age',
      title: `How old are ${isForSelf ? 'you' : 'they'}?`,
      answers: [
        '1-2',
        '3-4',
        '4-5',
        '6-10',
        '11-13',
        '14-16',
        '17-20',
        '21-30',
        '31-40',
        '41-50',
        '>50',
      ],
    },
    {
      id: 'occassion',
      title: 'What is the occassion?',
      answers: [
        'Anniversary',
        'Birthday',
        'Holiday',
        'Graduation',
        'White Elephant',
        'Who Need an occasion?',
      ],
    },
    {
      id: 'type',
      title: `Are ${isForSelf ? 'you' : 'they'} more: `,
      answers: ['Practical', 'Whimsical'],
    },
    {
      id: 'hobbies',
      title: 'What about hobbies?',
      answers: [
        'Camping',
        'Health & Wellness',
        'Home Chef/Cooking',
        'Mixology/Alcohol',
        'Music',
        'Reading',
        'Technology',
        'Other:',
      ],
    },
    {
      id: 'price',
      title: 'Price Range?',
      answers: ['<$50', '<$100', '<$200', '+$200'],
    },
    {
      id: 'createAccount',
      title: 'Do you want to create an account?',
      answers: ['Yes', 'Not at this time'],
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
              id={quizData.id}
              render={({ next }) => (
                <QuizQuestion
                  handleResponse={handleResponse}
                  next={next}
                  id={quizData.id}
                  title={quizData.title}
                  answers={quizData.answers}
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
