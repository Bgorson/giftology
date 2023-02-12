import React, { useState } from "react";
import {
  Container,
  Header,
  Description,
  InputContainer,
  InputField,
  SubmitButton,
} from "./styles";
import { postToMailingList } from "./../../../../../api/postToMailingList";

export default function JoinCommunity() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("Join Giftology!");
  const [submitIsDisabled, setSubmitIsDisabled] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit", name, email);
    postToMailingList(name, email);
    setName("");
    setEmail("");
    setButtonText("Thanks for joining!");
    setSubmitIsDisabled(true);
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
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Full Name"
        ></InputField>
        <InputField
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type={"email"}
          placeholder="Email Address"
        ></InputField>
        <SubmitButton
          disabled={submitIsDisabled}
          onClick={(e) => handleSubmit(e)}
        >
          {buttonText}
        </SubmitButton>
      </InputContainer>
    </Container>
  );
}
