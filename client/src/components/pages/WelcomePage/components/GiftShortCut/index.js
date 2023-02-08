import React from "react";
import {
  Header,
  ShortCut,
  ShortCutCollection,
  Container,
  CallToActionContainer,
} from "./styles";

export default function GiftShortCut() {
  return (
    <Container>
      <CallToActionContainer>
        <Header> Who 's Getting the Gift</Header>
        <ShortCutCollection>
          <ShortCut>Relative</ShortCut>

          <ShortCut>Colleague</ShortCut>
          <ShortCut>Myself</ShortCut>
          <ShortCut>Friend</ShortCut>
        </ShortCutCollection>
      </CallToActionContainer>
    </Container>
  );
}
