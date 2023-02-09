import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import {
  Container,
  HeaderText,
  StepDescription,
  StepsContainer,
  StepHeader,
  Icon,
  TakeQuizButton,
  CreateAccountButton,
  StepContent,
  StepMainContent,
  ButtonContainer,
} from "./styles";
import { GoogleLogin } from "react-google-login";
import { loginUser } from "../../../../../api/login";
import experience_tile from "../../../../../experience_tile.png";
import backgroundHomeImage from "../../../../../backgroundHomeImage.png";
import personalized_tile from "../../../../../personalized_tile.png";
import self_care_tile from "../../../../../self_care_tile.png";
import checkmark from "../../../../../checkmark.svg";
import { UserContext } from "../../../../../context/UserContext";

const clientId =
  "1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com";
export default function GiftSpecialOccasions() {
  let history = useHistory();
  const routeChange = () => {
    let path = `/quiz`;
    history.push(path);
  };
  const { loggedIn } = useContext(UserContext);

  const onSuccess = async (res) => {
    const response = await loginUser(res.tokenId);
    loggedIn({ token: response.token, email: response.user.email });
    localStorage.setItem("userEmail", response.user.email);
  };
  const onFailure = (res) => {
    console.log("failed to login: ", res);
  };
  return (
    <Container>
      <HeaderText>
        You can never go wrong on special occasions ever again
      </HeaderText>
      <StepsContainer>
        <StepMainContent>
          <Icon src={experience_tile} />
          <StepContent>
            <StepHeader>Create profiles for your loved ones</StepHeader>
            <StepDescription>
              Create profiles for your loved ones
            </StepDescription>
          </StepContent>
        </StepMainContent>
        <Icon size={"small"} src={checkmark} />
      </StepsContainer>
      <StepsContainer>
        <StepMainContent>
          <Icon src={backgroundHomeImage} />
          <StepContent>
            <StepHeader>
              Get notified when an event (birthday, anniversary..) is coming up
            </StepHeader>
            <StepDescription>
              When a user creates a profile, they can set up notifications for
              special occasions
            </StepDescription>
          </StepContent>
        </StepMainContent>
        <Icon size={"small"} src={checkmark} />
      </StepsContainer>
      <StepsContainer>
        <StepMainContent>
          <Icon src={personalized_tile} />
          <StepContent>
            <StepHeader>
              Get weekly recommendations on randomized gifts
            </StepHeader>
            <StepDescription>
              New gifts are added regularly, so you can always find something
              new
            </StepDescription>
          </StepContent>
        </StepMainContent>
        <Icon size={"small"} src={checkmark} />
      </StepsContainer>
      <StepsContainer>
        <StepMainContent>
          <Icon src={self_care_tile} />
          <StepContent>
            <StepHeader>
              Get products for people in your life right in your mail
            </StepHeader>
            <StepDescription>
              You'll receive notifications about gifts you can buy for your
              loved ones
            </StepDescription>
          </StepContent>
        </StepMainContent>
        <Icon size={"small"} src={checkmark} />
      </StepsContainer>
      <ButtonContainer>
        <GoogleLogin
          clientId={clientId}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <CreateAccountButton onClick={renderProps.onClick}>
              Make an Account
            </CreateAccountButton>
          )}
        />
        <TakeQuizButton onClick={routeChange}>Take the Quiz</TakeQuizButton>
      </ButtonContainer>
    </Container>
  );
}
