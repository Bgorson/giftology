import React from "react";

import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";

export default function QuizQuestion(props) {
  const { title, answers, handleResponse, next, id } = props;
    console.log(id)
  const possibleAnswers = answers.map((answers) => (
    <button
      onClick={() => {
        handleResponse(id, answers);
        next();
      }}
      type={"submit"}
      key={answers}
    >
      {answers}
    </button>
  ));

  return id !== "results" ? (
    <Container>
      <Title>{title}</Title>
      {possibleAnswers}
    </Container>
  ) : (
    <Container>
      <Title>RESULTS</Title>
    </Container>
  );
}
