import React from "react";
import {
  Header,
  ShortCut,
  ShortCutCollection,
  Container,
  CallToActionContainer,
} from "./styles";
import ReactGA from "react-ga4";

export default function GiftShortCut({ routeChange }) {
  return (
    <Container>
      <CallToActionContainer>
        <Header>Who are you shopping for?</Header>
        <ShortCutCollection>
          <ShortCut
            onClick={() => {
              ReactGA.event({
                category: "User-ShortCut",
                action: "Clicked on the Relative category",
              });
              routeChange("quiz/name", "relative");
            }}
          >
            Relative
          </ShortCut>

          <ShortCut
            onClick={() => {
              ReactGA.event({
                category: "User-ShortCut",
                action: "Clicked on the Coworker category",
              });
              routeChange("quiz/howMany", "coworker");
            }}
          >
            Coworker
          </ShortCut>
          <ShortCut
            onClick={() => {
              ReactGA.event({
                category: "User-ShortCut",
                action: "Clicked on the Myself category",
              });
              routeChange("quiz/name", "myself");
            }}
          >
            Myself
          </ShortCut>
          <ShortCut
            onClick={() => {
              ReactGA.event({
                category: "User-ShortCut",
                action: "Clicked on the Friend category",
              });
              routeChange("quiz/name", "friend");
            }}
          >
            Friend
          </ShortCut>
        </ShortCutCollection>
      </CallToActionContainer>
    </Container>
  );
}
