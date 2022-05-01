import React from 'react';

import { Container, TextDescription } from './styles';

export default function AboutPage() {
  return (
    <div>
      <Container>
        <h1>History of Giftology</h1>
        <TextDescription>
          We’ve all been there, it’s Christmas and you’re putting together a
          list of gift ideas. But what do you get for your Uncle whose only
          hobbies are grilling and going for walks with his dog? At Giftology,
          we believe a little inspiration goes a long way. We’ve compiled a list
          of our favorite gifts and gear to guide you. Whether you are shopping
          for someone who has everything or looking to brighten up your own
          life, we’ve got you covered.
        </TextDescription>
        <br />
        <TextDescription>
          Note: As an Amazon Associate we earn from qualifying purchases.
        </TextDescription>
      </Container>
    </div>
  );
}
