import React, { useState, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import ReactGA from "react-ga4";

import LoginModal from "../molecules/LoginModal";

import gift from "../../gift.png";
import ProductCard from "../atoms/CardV2";
import { UserContext } from "../../context/UserContext";

const shake = keyframes`
    0% { transform: translate(-8px, -14px); }
    33% { transform: translate(-10px, -14px); }
    66% { transform: translate(-10px, -16px); }
    100% { transform: translate(-8px, -16px); }
`;

const Circle = styled.img`
  cursor: pointer;
  transform: translate(-9px, -15px);
  width: 142px;
  margin: 0 auto;
  &:hover {
    animation: ${shake} 0.3s infinite alternate;
  }
`;

const CircleContainer = styled.div`
  cursor: pointer;
  position: relative;

  border: 1px solid black;
  border-radius: 3em;
  display: flex;
  padding: 15px;

  height: 450px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  visibility: ${(props) => (props.out ? "hidden" : "visible")};
  transition: visibility 1s linear;
  ${(props) =>
    props.visible &&
    css`
      /* background: #27eaf4;
      background: -webkit-linear-gradient(top left, #27eaf4, #208dc5);
      background: -moz-linear-gradient(top left, #27eaf4, #208dc5);
      background: linear-gradient(to bottom right, #27eaf4, #208dc5); */
    `}
  ${(props) =>
    !props.visible &&
    css`
      /* flex-basis: auto; */
      display: block;
    `}
    @media (max-width: 768px) {
    padding: 0px;
  }
`;

export default function ({ product, handleCardClick, isFavorite, quizId }) {
  const temporaryTest = false;
  const { isLoggedIn } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    if (!temporaryTest || isLoggedIn) {
      setIsVisible(false);
      if (visible) {
        ReactGA.event({
          category: "Gift Box Selected",
          action: product.product_name,
          value: product?.product_name,
        });
      }
    } else {
      setIsOpen(true);
    }
  };
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const [visible, setIsVisible] = useState(true);

  return (
    <>
      {visible && (
        <CircleContainer visible={visible} onClick={() => handleClick()}>
          <>
            {/* <TeaserText>{'Click to reveal your top gifts!'}</TeaserText> */}
            <Circle src={gift}></Circle>
            {"Click to reveal surprise gift"}
          </>
        </CircleContainer>
      )}

      {!visible && (
        <ProductCard
          isFavorite={isFavorite}
          quizId={quizId}
          isHighlighted={true}
          handleCardClick={handleCardClick}
          product={product}
        />
      )}
      {isOpen && (
        <LoginModal
          open={isOpen}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        />
      )}
    </>
  );
}
