import React from "react";
import {
  Header,
  ShortCut,
  ShortCutCollection,
  Container,
  CallToActionContainer,
} from "./styles";

export default function GiftShortCut({ routeChange }) {
  return (
    <Container>
      <CallToActionContainer>
        <Header>Who are you shopping for?</Header>
        <ShortCutCollection>
          <ShortCut
            onClick={() => {
              routeChange("quiz/name", "relative");
            }}
          >
            Relative
          </ShortCut>

          <ShortCut
            onClick={() => {
              routeChange("quiz/howMany", "coworker");
            }}
          >
            Coworker
          </ShortCut>
          <ShortCut
            onClick={() => {
              routeChange("quiz/name", "myself");
            }}
          >
            Myself
          </ShortCut>
          <ShortCut
            onClick={() => {
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
