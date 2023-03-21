import React, { useEffect, useContext, useState } from "react";
import Logout from "../../molecules/LogoutButton";
import { getUser } from "../../../api/user";
import { UserContext } from "../../../context/UserContext";
import { hobbyMap } from "../../../utils/hobbyMap";
import { coworkerTagMap } from "../../../utils/coworkerTagMap";
import ProfileTiles from "./components/ProfileTiles";
import JoinCommunity from "../WelcomePage/components/JoinCommunity";
import { removeProfile } from "../../../api/removeProfile";
import { updateProfilePicture } from "../../../api/updateProfilePicture";

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
  HeaderText,
  ProfileGrid,
  LogoutButtonContainer,
  Header,
} from "./styles";

export default function ProfilePage() {
  const { token, loggedOut } = useContext(UserContext);
  const [profileData, setProfileData] = useState();

  const uploadNewImage = (id) => {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "deruncuzv",
        uploadPreset: "jedjicbi",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log(result.info.url);
          updateProfilePicture(id, result.info.url, token).then((data) => {
            setProfileData(data);
          });
        }
      }
    );
    widget.open();
  };
  const fetchUser = async () => {
    try {
      const res = await getUser(token || localStorage.getItem("token"));
      setProfileData(res);
    } catch (err) {
      console.log("ERROR", err);
      loggedOut();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleProfileDelete = (id) => {
    removeProfile(id, token).then((data) => {
      setProfileData(data);
    });
  };
  return (
    <div>
      <Container>
        <Header>All your Profiles in One Place</Header>
        <HeaderText>
          Profiles are generated for all quizes you've taken
        </HeaderText>
        {/* {JSON.stringify(profileData)} */}
        <ProfileGrid>
          {profileData &&
            profileData.userData.length > 0 &&
            profileData.userData.map((data, index) => (
              <ProfileTiles
                uploadNewImage={uploadNewImage}
                handleProfileDelete={handleProfileDelete}
                profileData={data}
              />
            ))}
        </ProfileGrid>

        {/* {profileData &&
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
          ))} */}
        {/* <ButtonContainer>
          <ProfileButton onClick={() => history.push("quiz/")}>
            New Profile
          </ProfileButton>
        </ButtonContainer> */}
      </Container>
      <LogoutButtonContainer>
        <Logout />
      </LogoutButtonContainer>
      <JoinCommunity />
    </div>
  );
}
