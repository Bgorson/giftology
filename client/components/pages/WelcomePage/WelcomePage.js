import React from 'react';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';

export default function WelcomePage() {
  return (
    <div className="welcome-page page">
      <Section>
        <Container>
          <Title size="1">Welcome Page!</Title>
        </Container>
      </Section>
    </div>
  );
}
