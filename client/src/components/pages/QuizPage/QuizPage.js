import React, { useState } from 'react';
import { Wizard, Steps, Step } from 'react-albus';
import QuizQuestion from '../../organisms/QuizQuestion/QuizQuestion';
import { Route } from 'react-router-dom';

const Quiz = () => {
  const [answers, setAnswers] = useState({});
  // const [isForCoworkers, setIsForCoworkers] = useState(false);
  const [isForSelf, setIsForSelf] = useState(false);
  const [quizAge, setQuizAge] = useState(0);

  const handleResponse = (id, response, isMulti) => {
    window.scrollTo(0, 0);

    if (id === 'who' && response === 'Myself') {
      setIsForSelf(true);
    }
    // if (id === 'who' && response === 'A Coworker') {
    //   setIsForCoworkers(true);
    // }
    // if (id === 'howMany' && response === '1') {
    //   setIsForCoworkers(false);
    // }
    if (id === 'age') {
      setQuizAge(response);
    }
    const newInput = `${id}`;

    if (id === 'additionalTags') {
      let currentTags = answers['tags'];

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
    // console.log('CURRENT ASNWERS', answers);
  };

  const quizQuestions = [
    {
      id: 'who',
      title: 'Who are you shopping for?',
      answers: [
        { message: 'Myself', value: 'myself' },
        { message: 'A Coworker', value: 'coworker' },
        { message: 'A Relative', value: 'relative' },
        { message: 'A Friend', value: 'friend' },
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
      id: 'age',
      title: `How old are ${isForSelf ? 'you' : 'they'}?`,
      answers: [
        { message: '0-2', value: '0-2' },
        { message: '3-5', value: '3-5' },
        { message: '6-11', value: '6-11' },
        { message: '12-20', value: '12-20' },
        { message: '21-44', value: '21-44' },
        { message: '45-65', value: '45-65' },
        { message: '65+', value: '65-100' },
      ],
    },
    {
      id: 'occasion',
      title: 'What is the Occasion?',
      answers: [
        { message: 'Anniversary', value: 'anniversary' },
        { message: 'Birthday', value: 'birthday' },
        { message: 'Holiday', value: 'holiday' },
        { message: 'White Elephant', value: 'whiteElephant' },
        { message: 'Who Needs An Occasion?', value: 'any' },
      ],
      // hasAdditionalField: 'date',
    },
    {
      id: 'hobbies',
      title: 'What about hobbies?',
      isMulti: true,
      answers: [
        { message: 'Arts and Crafts', value: 'artsAndCrafts' },
        { message: 'Board Games', value: 'boardGames' },
        { message: 'Camping', value: 'camping' },
        { message: 'Gaming', value: 'gaming' },
        { message: 'Gardening', value: 'gardening' },
        { message: 'Health & Wellness', value: 'healthAndWellness' },
        { message: 'Home Chef/Cooking', value: 'homeChef' },
        { message: 'Mixology/Alcohol', value: 'mixology' },
        { message: 'Outdoor Games', value: 'outdoorGames' },
        { message: 'Reading', value: 'reading' },
        { message: 'Technology', value: 'technology' },
      ],
    },
    {
      id: 'type',
      title: "You're looking for items that are: ",
      isMulti: true,
      answers: [
        { message: 'Essential', value: 'essentials' },
        { message: 'Interesting and Fun', value: 'interestingAndFun' },
        { message: 'Thoughtful', value: 'thoughtful' },
      ],
    },
    {
      id: 'tags',
      title: `Describe ${isForSelf ? 'your' : 'their'} personality`,
      isMulti: true,
      answers: [
        { message: 'Artsy', value: 'artsy' },
        { message: 'Creative', value: 'creative' },
        { message: 'Quirky', value: 'quirky' },
        { message: 'Practical', value: 'practical' },
        { message: 'Organized', value: 'organized' },
        { message: 'Efficient', value: 'efficient' },
        { message: 'Athletic', value: 'athletic' },
        { message: 'Competitive', value: 'competitive' },
        { message: 'Handy', value: 'handy' },
        { message: 'Eco-Friendly', value: 'ecoFriendly' },
        { message: 'Classy', value: 'classy' },
        { message: 'Nerdy', value: 'nerdy' },
        { message: 'Trendy', value: 'trendy' },
      ],
    },
    {
      id: 'additionalTags',
      title: `What are ${isForSelf ? 'your' : 'their'} interests?`,
      isMulti: true,
      answers: [
        { message: 'Indoors', value: 'indoors' },
        { message: 'Outdoors', value: 'outdoors' },
        { message: 'Travel', value: 'travel' },
        { message: 'Coffee', value: 'coffee' },
        { message: 'Tea', value: 'tea' },
        { message: 'Alcohol', value: 'alcohol' },
        { message: 'Bath & Body', value: 'bathAndBody' },
        { message: 'Home Decor', value: 'homeDecor' },
        { message: 'Home Office', value: 'homeOffice' },
        { message: 'Cats', value: 'cats' },
        { message: 'Dogs', value: 'dogs' },
        { message: 'Books', value: 'books' },
        { message: 'Music', value: 'music' },
        { message: 'Technology', value: 'technology' },
      ],
    },
    // {
    //   id: 'price',
    //   title: 'Price Range?',
    //   answers: [
    //     { message: '<$50', value: '0-50' },
    //     { message: '<$100', value: '0-100' },
    //     { message: '<$200', value: '0-200' },
    //     { message: '+$200', value: '200-999999' },
    //   ],
    // },
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
    // const quizCoWorkerQuestions = [
    //   {
    //     id: 'howMany',
    //     title: 'How many coworkers?',
    //     answers: [
    //       { message: '1', value: '1' },
    //       { message: '2-5', value: '2-5' },
    //       { message: '6-11', value: '6-11' },
    //       { message: '12-20', value: '12-20' },
    //       { message: '20+', value: '20-10000' },
    //     ],
    //   },
    //   {
    //     id: 'occasion',
    //     title: 'What is the Occasion?',
    //     answers: [
    //       { message: 'Anniversary', value: 'anniversary' },
    //       { message: 'Birthday', value: 'birthday' },
    //       { message: 'Holiday', value: 'holiday' },
    //       { message: 'White Elephant', value: 'whiteElephant' },
    //       { message: 'Who Needs An Occasion?', value: 'any' },
    //     ],
    //   },
    //   {
    //     id: 'price',
    //     title: 'Price Range?',
    //     answers: [
    //       { message: '$0-$10', value: '0-10' },
    //       { message: '$10-$30', value: '10-30' },
    //       { message: '$30-$50', value: '30-50' },
    //       { message: '$50-$100', value: '50-100' },
    //       { message: '+$100', value: '100-999999' },
    //     ],
    //   },

    {
      id: 'results',
      title: '',
      answers: [''],
    },
  ];
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
      )}
    />
  );
};

export default Quiz;
