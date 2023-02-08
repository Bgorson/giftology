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
        <GiftText>Make profiles for your friends & loved ones</GiftText>
      </GiftInformation>
      <GiftInformation>
        <Icon src={giftBox} />
        <GiftText>
          Take the quiz and let giftology take care of the rest for you
        </GiftText>
      </GiftInformation>
      <GiftInformation>
        <Icon src={profile} />
        <GiftText>Make profiles for your friends & loved ones </GiftText>
      </GiftInformation>
    </Container>
  );
}
