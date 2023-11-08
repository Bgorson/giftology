import React from 'react';

import { Container, TextDescription } from './styles';

export default function FeedbackPage() {
  return (
    <div>
      <Container>
        <h1>Feedback Form</h1>
        <TextDescription>
          Giftology is currently a work in progress, and that means we can use
          your help. If you had a poor experience, have a suggestion, or just
          want to help the project, please fill out the survey at the link
          below.
        </TextDescription>
        <br />
        <a target={'_blank'} href="https://forms.gle/TkdHjXkyR36pvpYW6">
          Feedback Form
        </a>
      </Container>
    </div>
  );
}
