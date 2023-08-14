import React, { useState } from "react";
import {
  Container,
  Image,
  NameText,
  InterestsText,
  ImportantDateText,
  Type,
  Date,
  TextLink,
  ActionsContainer,
  ViewWishListButton,
  Icon,
  UpdateProfileImage,
  UpdateProfileContainer,
  UpdateProfileText,
  ImageWrapper,
  NextArrow,
  PreviousArrow,
} from "./styles";
import { useHistory } from "react-router";

import profile_test from "../../../../../profile_test.webp";
import { hobbyMap } from "../../../../../utils/hobbyMap";
import { coworkerTagMap } from "../../../../../utils/coworkerTagMap";
import viewPastQuiz from "../../../../../viewPastQuiz.png";
import delete_profile from "../../../../../delete_profile.svg";
import upload_icon from "../../../../../upload_icon.svg";
import Arrow from "../../../../../arrow.png";
import ReactGA from "react-ga4";

export default function ProfileTiles({
  profileData,
  handleProfileDelete,
  uploadNewImage,
  changeProfilePicture,
  arrayOfImages,
}) {
  const [imageHovered, setImageHovered] = useState(false);
  const history = useHistory();
  const { wishlist, id } = profileData;
  const { createAccount, hobbies, name, tags, coworkerTags, who } =
    profileData?.quizResults;

  const hobbyTransform = (hobbies) => {
    if (hobbies) {
      let string = "";

      hobbies.forEach((hobby) => {
        const val = hobbyMap.find((entry) => entry.value === hobby);
        string += `${val.message}, `;
      });
      return string.substring(0, string.length - 2);
    } else {
      return "";
    }
  };
  const onHover = () => {
    console.log("hover");
    setImageHovered(true);
  };
  const onLeave = () => {
    setImageHovered(false);
  };
  const navigateToQuizPage = (data) => {
    ReactGA.event({
      category: "Profile",
      action: `Navigated to quiz from profile, ${data.name}`,
      label: "ProfileButton",
    });

    localStorage.setItem("quizResults", JSON.stringify(data));
    localStorage.setItem("quizId", JSON.stringify(profileData.id));

    history.push("quiz/results");
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
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return "Name Not Entered";
    }
  }
  const changeImage = (direction) => {
    ReactGA.event({
      category: "Profile",
      action: `Changed profile image, ${name}`,
      label: "ProfileButton",
    });

    if (direction === "next") {
      const index = arrayOfImages.findIndex((image) => image === createAccount);
      if (index === arrayOfImages.length - 1) {
        changeProfilePicture(id, arrayOfImages[0]);
      } else {
        changeProfilePicture(id, arrayOfImages[index + 1]);
      }
    } else {
      const index = arrayOfImages.findIndex((image) => image === createAccount);
      if (index === 0) {
        changeProfilePicture(id, arrayOfImages[arrayOfImages.length - 1]);
      } else {
        changeProfilePicture(id, arrayOfImages[index - 1]);
      }
    }
  };
  return (
    <Container>
      <ImageWrapper>
        <NextArrow onClick={() => changeImage("next")}>
          <img src={Arrow} />
        </NextArrow>
        <PreviousArrow onClick={() => changeImage("previous")}>
          <img src={Arrow} />
        </PreviousArrow>
        <Image
          imageHovered={imageHovered}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onClick={() => changeImage("next")}
          src={
            createAccount ||
            "https://res.cloudinary.com/deruncuzv/image/upload/v1679963321/Use_for_default_profile_image1_etrene.jpg"
          }
        />
        <UpdateProfileContainer
          onClick={() => changeImage("next")}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          imageHovered={imageHovered}
        >
          <UpdateProfileImage src={upload_icon} />
          <UpdateProfileText>Change Profile Picture</UpdateProfileText>
        </UpdateProfileContainer>
      </ImageWrapper>

      <NameText>
        {capitalizeFirstLetter(name) || capitalizeFirstLetter(who)}
      </NameText>
      {hobbies && (
        <InterestsText>Interests: {hobbyTransform(hobbies)}</InterestsText>
      )}
      {coworkerTags && (
        <InterestsText>
          Interests: {coWorkerTagTransform(coworkerTags)}
        </InterestsText>
      )}
      {!hobbies && !coworkerTags && (
        <InterestsText>Interests: No Interests Entered</InterestsText>
      )}

      <ImportantDateText>
        <Type></Type>
        <Date></Date>
      </ImportantDateText>

      <ActionsContainer>
        <TextLink
          onClick={() =>
            navigateToQuizPage(profileData.quizResults, profileData.id)
          }
        >
          <Icon src={viewPastQuiz} />
          View Last Quiz
        </TextLink>
        <TextLink onClick={() => handleProfileDelete(id)}>
          <Icon src={delete_profile} />
          Remove Profile
        </TextLink>
      </ActionsContainer>
      <ViewWishListButton
        disabled={wishlist.length === 0}
        onClick={() => wishlist.length > 0 && history.push(`favorites/${id}`)}
      >
        View Wish List
      </ViewWishListButton>
    </Container>
  );
}
