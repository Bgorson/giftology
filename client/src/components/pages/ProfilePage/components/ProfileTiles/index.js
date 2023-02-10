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
} from "./styles";
import { useHistory } from "react-router";

import profile_test from "../../../../../profile_test.png";
import { hobbyMap } from "../../../../../utils/hobbyMap";
import { coworkerTagMap } from "../../../../../utils/coworkerTagMap";
import viewPastQuiz from "../../../../../viewPastQuiz.png";
import delete_profile from "../../../../../delete_profile.svg";
import upload_icon from "../../../../../upload_icon.svg";

export default function ProfileTiles({
  profileData,
  handleProfileDelete,
  uploadNewImage,
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
    localStorage.setItem("quizResults", JSON.stringify(data));
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
  return (
    <Container>
      <ImageWrapper>
        <Image
          imageHovered={imageHovered}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onClick={() => {
            uploadNewImage(id);
          }}
          src={createAccount || profile_test}
        />
        <UpdateProfileContainer
          onClick={() => {
            uploadNewImage(id);
          }}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          imageHovered={imageHovered}
        >
          <UpdateProfileImage src={upload_icon} />
          <UpdateProfileText>Update Profile</UpdateProfileText>
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
        <TextLink onClick={() => navigateToQuizPage(profileData.quizResults)}>
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
