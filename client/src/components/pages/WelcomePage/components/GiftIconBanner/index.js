import React from "react";
import { Container, GiftInformation, Icon, GiftText } from "./styles";
import conversation from "../../../../../conversation.svg";
import giftBox from "../../../../../gift-box.svg";
import profile from "../../../../../profile.svg";

export default function GiftIconBanner() {
  return (
    <Container>
      <GiftInformation>
        <Icon src={conversation} />
        <GiftText>
          Take the quiz and let Giftology take care of the rest for your
        </GiftText>
      </GiftInformation>
      <GiftInformation>
        <Icon src={giftBox} />
        <GiftText>Receive curated gift idea based on your responses</GiftText>
      </GiftInformation>
      <GiftInformation>
        <Icon src={profile} />
        <GiftText>Make profiles for your friends & loved ones </GiftText>
      </GiftInformation>
    </Container>
  );
}
