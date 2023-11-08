import React, { useEffect, useContext, useState } from "react";
import Logout from "../../molecules/LogoutButton";
import { getUser } from "../../../api/user";
import {getQuizes} from "../../../api/getQuizes";
import { UserContext } from "../../../context/UserContext";
import { hobbyMap } from "../../../utils/hobbyMap";
import { coworkerTagMap } from "../../../utils/coworkerTagMap";
import ProfileTiles from "./components/ProfileTiles";
import JoinCommunity from "../WelcomePage/components/JoinCommunity";
import { removeProfile } from "../../../api/removeProfile";
import { updateProfilePicture } from "../../../api/updateProfilePicture";
import ReactGA from "react-ga4";

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
  const arrayOfImages = [
    "https://res.cloudinary.com/deruncuzv/image/upload/v1679963321/Use_for_default_profile_image1_etrene.jpg",
    "https://res.cloudinary.com/deruncuzv/image/upload/v1679963313/Use_for_default_profile_image2_mhtngy.jpg",
    "https://res.cloudinary.com/deruncuzv/image/upload/v1679963312/Use_for_default_profile_image3_va1l7l.jpg",
  ];

  // const uploadNewImage = (id) => {
  //   let widget = window.cloudinary.createUploadWidget(
  //     {
  //       cloudName: "deruncuzv",
  //       uploadPreset: "jedjicbi",
  //     },
  //     (error, result) => {
  //       if (!error && result && result.event === "success") {
  //         console.log(result.info.url);
  //         updateProfilePicture(id, result.info.url, token).then((data) => {
  //           setProfileData(data);
  //         });
  //       }
  //     }
  //   );
  //   widget.open();
  // };
  const changeProfilePicture = (id, url) => {

    ReactGA.event({
      category: "Profile",
      action: `Clicked ${url}`,
      label: "ProfileButton",
    });
    updateProfilePicture(id, url, token).then((data) => {
      // setProfileData({...profileData, createAccount: data});
 
    });
    // let randomImage = arrayOfImages[Math.floor(Math.random() * 6)];
    // updateProfilePicture(id, randomImage, token).then((data) => {
    //   setProfileData(data);
    // });
  };
  const fetchUser = async () => {
    try {
      const res = await getQuizes(token || localStorage.getItem("token"));
      setProfileData(res);
    } catch (err) {
      console.log("ERROR", err);
      loggedOut();
      // window.location.href = "/";
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleProfileDelete = (id) => {
    ReactGA.event({
      category: "Profile",
      action: `Deleted Profile`,
      label: "ProfileButton",
    });

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
            profileData.length >0 &&
            profileData.map((data, index) => (
              <ProfileTiles
                key={index}
                arrayOfImages={arrayOfImages}
                changeProfilePicture={changeProfilePicture}
                // uploadNewImage={uploadNewImage}
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
