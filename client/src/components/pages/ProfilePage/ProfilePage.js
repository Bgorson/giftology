import React, { useEffect, useContext, useState } from "react";
import Logout from "../../molecules/LogoutButton";
import { getUser } from "../../../api/user";
import { UserContext } from "../../../context/UserContext";
import { useHistory } from "react-router";
import { hobbyMap } from "../../../utils/hobbyMap";
import { coworkerTagMap } from "../../../utils/coworkerTagMap";
import {
  Container,
  TextContainer,
  ProfileRow,
  ProfileButton,
  RelationshipText,
  BirthDayText,
  Title,
  HobbiesText,
  ButtonContainer,
} from "./styles";

export default function ProfilePage() {
  const history = useHistory();
  const { token, loggedOut } = useContext(UserContext);
  console.log("TOKEN", token);
  const [profileData, setProfileData] = useState();
  console.log("profileData", profileData);

  const hobbyTransform = (hobbies) => {
    let string = "";

    hobbies.forEach((hobby) => {
      const val = hobbyMap.find((entry) => entry.value === hobby);
      string += `${val.message}, `;
    });
    return string.substring(0, string.length - 2);
  };

  const coWorkerTagTransform = (tags) => {
    let string = "";

    tags.forEach((tag) => {
      const val = coworkerTagMap.find((entry) => entry.value === tag);
      string += `${val.message}, `;
    });
    return string.substring(0, string.length - 2);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => {
    try {
      getUser(token || localStorage.getItem("token")).then((data) => {
        setProfileData(data);
      });
    } catch (err) {
      console.log("ERROR", err);
      loggedOut();
    }
  }, [token]);

  const navigateToQuizPage = (data) => {
    localStorage.setItem("quizResults", JSON.stringify(data));
    history.push("quiz/results");
  };
  return (
    <div>
      <Container>
        {/* {JSON.stringify(profileData)} */}
        {profileData &&
          profileData.userData.map((data, index) => (
            <ProfileRow key={index}>
              <TextContainer>
                <Title>
                  {data.quizResults.name ||
                    capitalizeFirstLetter(data.quizResults.who)}{" "}
                </Title>
                {data.quizResults.name && (
                  <RelationshipText>
                    Relationship: {capitalizeFirstLetter(data.quizResults.who)}
                  </RelationshipText>
                )}
                {/* <BirthDayText>Birthday: 12/12/12</BirthDayText> */}
                {data.quizResults.hobbies && (
                  <HobbiesText>
                    Hobbiest and Interests:{" "}
                    {hobbyTransform(data.quizResults.hobbies)}
                  </HobbiesText>
                )}
                {data.quizResults.coworkerTags && (
                  <HobbiesText>
                    Coworker Interests:{" "}
                    {coWorkerTagTransform(data.quizResults.coworkerTags)}
                  </HobbiesText>
                )}
              </TextContainer>
              <ButtonContainer>
                <ProfileButton
                  onClick={() => navigateToQuizPage(data.quizResults)}
                >
                  Last Quiz
                </ProfileButton>
                <ProfileButton
                  disabled={data.wishlist.length === 0}
                  onClick={() =>
                    data.wishlist.length > 0 &&
                    history.push(`favorites/${data.id}`)
                  }
                >
                  WishList
                </ProfileButton>
              </ButtonContainer>
            </ProfileRow>
          ))}
        <ButtonContainer>
          <ProfileButton onClick={() => history.push("quiz/")}>
            New Profile
          </ProfileButton>
        </ButtonContainer>
      </Container>
      <Logout />
    </div>
  );
}
