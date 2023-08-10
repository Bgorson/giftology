import React from "react";
import about1 from "../../../about1.webp";
import about2 from "../../../about2.webp";

import {
  Container,
  TextDescription,
  Disclaimer,
  TextContent,
  ImageContainer,
  ImageOne,
  TextHeader,
  ImageTwo,
} from "./styles";
export default function AboutPage() {
  return (
    <>
      <Container>
        <TextContent>
          <TextHeader>Our story and the beginnings of Giftology</TextHeader>
          <TextDescription>
            We’ve all been there, it’s Christmas and you’re putting together a
            list of gift ideas. But what do you get for your Uncle whose only
            hobbies are grilling and going for walks with his dog? At Giftology,
            we believe a little inspiration goes a long way. We’ve compiled a
            list of our favorite gifts and gear to guide you. Whether you are
            shopping for someone who has everything or looking to brighten up
            your own life, we’ve got you covered.
          </TextDescription>
        </TextContent>
        <ImageContainer>
          <ImageOne src={about1} />
          <ImageTwo src={about2} />
        </ImageContainer>
      </Container>
      <Disclaimer>
        <b>Disclaimer: </b> Hey guys, just so you know we make a little bit of
        cash when you book through our affiliate links and we are eternally
        grateful for your support in our little growing business.
      </Disclaimer>
    </>
  );
}
