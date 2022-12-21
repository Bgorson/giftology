import React, { useEffect, useContext, useState } from 'react';
import Logout from '../../molecules/LogoutButton';
import { getUser } from '../../../api/user';
import { UserContext } from '../../../context/UserContext';
import {
  Container,
  TextContainer,
  ProfileRow,
  LastQuizButton,
  WishListButton,
  RelationshipText,
  BirthDayText,
  Title,
  HobbiesText,
  ButtonContainer,
  NewProfileButton,
} from './styles';

export default function ProfilePage() {
  const { token } = useContext(UserContext);

  const [profile, setProfile] = useState();
  useEffect(() => {
    getUser(token).then((data) => {
      setProfile(data);
    });
  }, []);
  return (
    <div>
      <Container>
        {JSON.stringify(profile)}
        <ProfileRow>
          <TextContainer>
            <Title>Eli Socha</Title>
            <RelationshipText>Relationship: Self</RelationshipText>
            <BirthDayText>Birthday: 12/12/12</BirthDayText>
            <HobbiesText>Hobbiest and Interests: Cats</HobbiesText>
          </TextContainer>
          <ButtonContainer>
            <LastQuizButton> Last Quiz</LastQuizButton>
            <WishListButton>WishList</WishListButton>
          </ButtonContainer>
        </ProfileRow>
        <NewProfileButton>New Profile</NewProfileButton>
      </Container>
      <Logout />
    </div>
  );
}
