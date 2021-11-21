import React from 'react';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';

export default function HomePage() {
  return (
    <div className="home-page page">
      <Section>
        <Container>
          <Title size="1">Home Page</Title>
        </Container>
      </Section>
    </div>
  );
}
