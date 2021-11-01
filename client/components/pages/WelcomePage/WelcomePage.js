import React from "react";

import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import Button from "../../atoms/Button";
import { useHistory } from "react-router";

export default function WelcomePage() {
  const history = useHistory();
  return (
    <div className="welcome-page page">
      <Section>
        <Container>
          <Title size="1">Welcome to Giftology!</Title>
          <Button
            onClick={() => history.push("/quiz")}
            label={"Click to Access Quiz"}
          />
        </Container>
      </Section>
    </div>
  );
}
