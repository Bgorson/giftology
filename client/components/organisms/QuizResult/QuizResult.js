import React from "react";

import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";

export default function QuizResult(props) {
  const { results } = props;
    console.log(results)
  return (
    <Container>
      <Title>RESULTS</Title>
      <p>{JSON.stringify(results)}</p>
    </Container>
  );
}
