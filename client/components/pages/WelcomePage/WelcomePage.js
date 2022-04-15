import React from 'react';
import { Link } from 'react-router-dom';
import ProductResult from '../../organisms/ProductResult/ProductResult';
import categoryScores from './categoryData.json';
import products from './productData.json';

import {
  Hero,
  HeroCallToAction,
  HeroDescription,
  HeroTitle,
  HeroImage,
  HeroText,
  FancyButton,
} from './styles';

const data = {
  categoryScores,
  products,
};

export default function WelcomePage() {
  return (
    <div className="welcome-page page">
      <Hero>
        <HeroImage src="/images/backgroundImage.jpeg" />
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
