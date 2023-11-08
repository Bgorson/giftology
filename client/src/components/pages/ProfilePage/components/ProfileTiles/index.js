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
  const { createaccount, favorite_products,quiz_id, hobbies, name, tags, coworkerTags, who } =
    profileData;
  const [imageURL, setImageURL] = useState(createaccount||arrayOfImages[0]);

  const hobbyTransform = (hobbies) => {
    if (hobbies) {
      let string = "";
      const array_of_strings = hobbies
  .replace('{', '')
  .replace('}', '')
  .replace(/"/g, '')
  .split(',');
      array_of_strings.forEach((hobby) => {
        const val = hobbyMap.find((entry) => entry.value === hobby);
        string += `${val.message}, `;
      });
      return string.substring(0, string.length - 2);
    } else {
      return "";
    }
  };
  const onHover = () => {
    setImageHovered(true);
  };
  const onLeave = () => {
    setImageHovered(false);
  };
  const navigateToQuizPage = (data) => {
    ReactGA.event({
      category: "Profile",
      action: `Navigated to quiz from profile, ${data?.name}`,
      label: "ProfileButton",
    });
    function stringToArray(inputString) {
      // Remove leading and trailing curly braces if present
      if (inputString.startsWith('{') && inputString.endsWith('}')) {
        inputString = inputString.slice(1, -1);
      }
    
      // Split the string using comma as the delimiter and remove surrounding double quotes
      const stringArray = inputString.split(',').map(item => item.trim().replace(/"/g, ''));
    
      return stringArray;
    }
    let quizDataToSet = {
      ...data,
      hobbies: data.hobbies? stringToArray(data.hobbies):[],
      tags: data.tags? stringToArray(data.tags):[],
    }
    localStorage.setItem("quizResults", JSON.stringify(quizDataToSet));
    localStorage.setItem("quizId", profileData.quiz_id);

    history.push("quiz/results");
  };
  const coWorkerTagTransform = (tags) => {
    let string = "";
    if (tags){
      const array_of_strings = tags
  .replace('{', '')
  .replace('}', '')
  .replace(/"/g, '')
  .split(',');
  array_of_strings.forEach((tag) => {
      const val = coworkerTagMap.find((entry) => entry.value === tag);
      string += `${val.message}, `;
    });
    return string.substring(0, string.length - 2);
  }
  else{
    return "";
  };
}

  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return "Name Not Entered";
    }
  }


  const changeImage = (quiz_id, direction) => {
    ReactGA.event({
      category: "Profile",
      action: `Changed profile image, ${name}`,
      label: "ProfileButton",
    })
    if (direction==='next'){
      const index = arrayOfImages.indexOf(imageURL);
      if (index === arrayOfImages.length-1){
        changeProfilePicture(quiz_id, arrayOfImages[0]);
        setImageURL(arrayOfImages[0]);
      }
      else{
        changeProfilePicture(quiz_id, arrayOfImages[index+1]);
        setImageURL(arrayOfImages[index+1]);
      }
    }
    else{
      const index = arrayOfImages.indexOf(imageURL);
      if (index === 0){
        changeProfilePicture(quiz_id, arrayOfImages[arrayOfImages.length-1]);
        setImageURL(arrayOfImages[arrayOfImages.length-1]);
      }
      else{
        changeProfilePicture(quiz_id, arrayOfImages[index-1]);
        setImageURL(arrayOfImages[index-1]);
      }
    }
  }
  
    // const newIndex =
    //   direction === "next"
    //     ? (currentIndex + 1) % arrayOfImages.length
    //     : direction === "previous"
    //     ? (currentIndex - 1 + arrayOfImages.length) % arrayOfImages.length
    //     : currentIndex;
  
    // const newURL = arrayOfImages[newIndex];
    // changeProfilePicture(quiz_id, newURL);
    // setImageURL(newURL);
  
    // currentIndex = newIndex;
  
  
  
  
  
  return (
    <Container>
      <ImageWrapper>
        <NextArrow onClick={() => changeImage(profileData.quiz_id,"next")}>
          <img src={Arrow} />
        </NextArrow>
        <PreviousArrow onClick={() => changeImage(profileData.quiz_id,"previous")}>
          <img src={Arrow} />
        </PreviousArrow>
        <Image
          imageHovered={imageHovered}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onClick={() => changeImage(profileData.quiz_id,"next")}
          src={
            imageURL ||
            "https://res.cloudinary.com/deruncuzv/image/upload/v1679963321/Use_for_default_profile_image1_etrene.jpg"
          }
        />
        <UpdateProfileContainer
          onClick={() => changeImage(profileData.quiz_id,"next")}
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
            navigateToQuizPage(profileData)
          }
        >
          <Icon src={viewPastQuiz} />
          View Last Quiz
        </TextLink>
        <TextLink onClick={() => handleProfileDelete(quiz_id)}>
          <Icon src={delete_profile} />
          Remove Profile
        </TextLink>
      </ActionsContainer>
      <ViewWishListButton
        disabled={favorite_products?.length === 1 && favorite_products[0] === null}
        onClick={() => favorite_products?.length > 0 && history.push(`favorites/${quiz_id}`)}
      >
        View Wish List
      </ViewWishListButton>
    </Container>
  );
}
