import styled, { css } from "styled-components";

export const TextDescription = styled.p`
  margin-top: 2em;
  font-size: 18px;
`;
export const Container = styled.div`
  margin: auto;
  width: 66%;
  padding-bottom: 2em;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ProfileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProfileButton = styled.button`
  background-color: #44a2bb;
  white-space: nowrap;
  min-width: 280px;
  color: black;
  cursor: pointer;
  padding: 0.5em;
  font-size: 20px;
  ${(props) =>
    props.disabled &&
    css`
      background-color: grey;
      cursor: not-allowed;
    `}
`;
export const RelationshipText = styled.p``;
export const BirthDayText = styled.p``;
export const Title = styled.h1``;
export const HobbiesText = styled.p``;
export const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5em;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
