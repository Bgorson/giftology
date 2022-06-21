import React from 'react';
import { Wizard, Steps, Step } from 'react-albus';
import QuizQuestion from '../../organisms/QuizQuestion/QuizQuestion';
import { Route } from 'react-router-dom';

const Quiz = () => {
  const [answers, setAnswers] = React.useState({});
  const [isForSelf, setIsForSelf] = React.useState(false);
  const [quizAge, setQuizAge] = React.useState(0);

  const handleResponse = (id, response, isMulti) => {
    window.scrollTo(0, 0);

    if (id === 'who' && response === 'Myself') {
      setIsForSelf(true);
    }
    if (id === 'age') {
      setQuizAge(response);
    }
    const newInput = `${id}`;
    if (isMulti) {
      answers[newInput] = response;
    } else {
      answers[newInput] = response.value;
    }

    setAnswers(answers);
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
      title: `Describe ${
        isForSelf ? 'your' : 'their'
      } personality and interests`,
      isMulti: true,
      answers: [
        { message: 'Alcohol', value: 'alcohol' },
        { message: 'Artsy', value: 'artsy' },
        { message: 'Athletic', value: 'athletic' },
        { message: 'Bath & Body', value: 'bathAndBody' },
        { message: 'Books', value: 'books' },
        { message: 'Cats', value: 'cats' },
        { message: 'Classy', value: 'classy' },
        { message: 'Coffee', value: 'coffee' },
        { message: 'Competitive', value: 'competitive' },
        { message: 'Creative', value: 'creative' },
        { message: 'DIY', value: 'diy' },
        { message: 'Dogs', value: 'dogs' },
        { message: 'Eco-Friendly', value: 'ecoFriendly' },
        { message: 'Efficient', value: 'efficient' },
        { message: 'Indoors', value: 'indoors' },
        { message: 'Health Nut', value: 'healthNut' },
        { message: 'Home Decor', value: 'homeDecor' },
        { message: 'Home Office', value: 'homeOffice' },
        { message: 'Music', value: 'music' },
        { message: 'Nerdy', value: 'nerdy' },
        { message: 'Organized', value: 'organized' },
        { message: 'Outdoors', value: 'outdoors' },
        { message: 'Practical', value: 'practical' },
        { message: 'Quirky', value: 'quirky' },
        { message: 'Science', value: 'science' },
        { message: 'Tea', value: 'tea' },
        { message: 'Tea', value: 'tea' },
        { message: 'Technology', value: 'technology' },
        { message: 'Trendy', value: 'trendy' },
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
