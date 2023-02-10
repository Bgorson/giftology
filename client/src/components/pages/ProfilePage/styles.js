import styled, { css } from "styled-components";

export const TextDescription = styled.p`
  margin-top: 2em;
  font-size: 18px;
`;
export const Container = styled.div`
  padding-top: 5em;
  margin: auto;
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

export const Header = styled.h1`
  text-align: center;
  padding-top: 80px;
`;
export const HeaderText = styled.p`
  text-align: center;
  padding-bottom: 80px;
  width: 30%;
  margin: auto;
  font-size: 14px;
  line-height: 32px;
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 90%;
  margin: auto;
  gap: 1em;
  justify-items: center;
  @media (max-width: 1280px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 830px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;
export const LogoutButtonContainer = styled.div`
  text-align: center;
  font-size: 30px;
`;
