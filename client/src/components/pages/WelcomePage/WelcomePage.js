import React from "react";
import { useHistory } from "react-router-dom";
import backgroundHomeImage from "../../../backgroundHomeImage.png";
import ellipse from "../../../ellipse.png";
import GiftShortCut from "./components/GiftShortCut";
import GiftIconBanner from "./components/GiftIconBanner";
import GiftCategories from "./components/GiftCategories";
import GiftSpecialOccasions from "./components/GiftSpecialOccasions";
import JoinCommunity from "./components/JoinCommunity";
import {
  Hero,
  HeroCallToAction,
  HeroDescription,
  HeroTitle,
  HeroContent,
  HeroImage,
  Ellipse,
} from "./styles";

export default function WelcomePage() {
  let history = useHistory();
  const routeChange = () => {
    let path = `/quiz`;
    history.push(path);
  };
  return (
    <div>
      <Hero>
        <HeroContent>
          <HeroTitle>{"Take the quiz to find the ideal gift"}</HeroTitle>
          <HeroDescription>
            Check out our gift quiz and we’ll do the searching for you. All you
            need to know is who you’re shopping for and what they do for fun.
            We’ll handle the rest.
          </HeroDescription>
          <HeroCallToAction onClick={routeChange}>
            Take The Quiz
          </HeroCallToAction>
        </HeroContent>
        <HeroImage src={backgroundHomeImage} />
        <Ellipse src={ellipse} />
      </Hero>
      <GiftShortCut />
      <GiftIconBanner />
      <GiftCategories />
      <GiftSpecialOccasions />
      <JoinCommunity />
    </div>
  );
}
