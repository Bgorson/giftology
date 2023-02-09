import React, { useState } from "react";
import {
  Container,
  Header,
  Description,
  InputContainer,
  InputField,
  SubmitButton,
} from "./styles";

export default function JoinCommunity() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit", name, email);
  };
  return (
    <Container>
      <Header>
        Join our little community and share in the joy gift-giving
      </Header>
      <Description>
        Subscribe to our newsletter and get notifications when your loved ones’
        birthdays are coming up
      </Description>
      <InputContainer>
        <InputField
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Full Name"
        ></InputField>
        <InputField
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type={"email"}
          placeholder="Email Address"
        ></InputField>
        <SubmitButton onClick={(e) => handleSubmit(e)}>
          Join Giftology!
        </SubmitButton>
      </InputContainer>
    </Container>
  );
}
