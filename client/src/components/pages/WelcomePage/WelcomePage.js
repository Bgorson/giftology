import React from "react";
import { useHistory } from "react-router-dom";
import backgroundHomeImage from "../../../backgroundHomeImage.webp";
import ellipse from "../../../ellipse.webp";
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
import ReactGA from "react-ga4";

export default function WelcomePage() {
  let history = useHistory();
  const routeChange = (route, queryParams) => {
    ReactGA.event({
      category: "User",
      action: "Clicked on Take the Quiz from Home Page",
    });
    let path = `/${route}${queryParams ? `?${queryParams}` : ""}`;
    history.push(path);
  };

  return (
    <div>
      <Hero>
        <HeroContent>
          <HeroTitle>
            {"Take the quiz and let Giftology take care of the rest for you"}
          </HeroTitle>
          <HeroDescription>
            Check out our gift quiz and we’ll do the searching for you. All you
            need to know is who you’re shopping for and what they do for fun.
            We’ll handle the rest.
          </HeroDescription>
          <HeroCallToAction onClick={() => routeChange("quiz")}>
            Take The Quiz
          </HeroCallToAction>
        </HeroContent>
        <HeroImage src={backgroundHomeImage} />
        <Ellipse src={ellipse} />
      </Hero>
      <GiftShortCut routeChange={routeChange} />
      <GiftIconBanner />
      <GiftCategories />
      <GiftSpecialOccasions />
      <JoinCommunity />
    </div>
  );
}
