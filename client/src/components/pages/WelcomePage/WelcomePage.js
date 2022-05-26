import React from 'react';
import { Link } from 'react-router-dom';

import backgroundImage from '../../../backgroundImage.jpeg';

import {
  Hero,
  HeroCallToAction,
  HeroDescription,
  HeroTitle,
  HeroImage,
  HeroText,
} from './styles';

export default function WelcomePage() {
  return (
    <div className="welcome-page page">
      <Hero>
        <HeroImage src={backgroundImage} />
        <HeroText>
          <HeroTitle>Having Trouble Finding The Right Gift?</HeroTitle>
          <HeroDescription>
            Check out our quiz and we’ll do the searching for you. All you need
            to know is who you’re shopping for and what they do for fun. We’ll
            handle the rest.
          </HeroDescription>
          <HeroCallToAction as={Link} to="/quiz">
            Take The Quiz
          </HeroCallToAction>
        </HeroText>
      </Hero>
      {/* <ProductResult data={data} /> */}
    </div>
  );
}