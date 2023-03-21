import styled from "styled-components";

export const Hero = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-around;
  height: 643px;
  background: linear-gradient(
    90deg,
    rgba(11, 138, 253, 0.2) 0%,
    rgba(197, 118, 255, 0.2) 100%
  );
  overflow: hidden;
`;

export const HeroCallToAction = styled.button`
  font-size: 12px;
  cursor: pointer;
  color: black;
  background-color: white;
  padding: 16px 24px;
  border-radius: 1.5em;
  text-transform: uppercase;
  &:hover {
    background-color: black;
    color: white;
  }
`;
export const HeroDescription = styled.p`
  font-size: 16px;
  line-height: 28px;
  font-family: "Slabo13px-Regular";
  margin: 16 0 24px 0;
  @media (max-width: 1025px) {
  }
`;
export const HeroTitle = styled.h1`
  font-family: "FiraSansCondensed-Black";
  font-weight: bold;
  font-size: 40px;
  margin-top: 0;
  @media (max-width: 1025px) {
    font-size: 32px;
  }
`;

export const HeroContent = styled.div`
  width: 440px;
  padding-left: 121px;
  @media (max-width: 768px) {
    text-align: center;
    padding: 0;
    width: 95%;
  }
`;

export const HeroImage = styled.img`
  max-width: 312px;
  max-height: 369px;
  @media (max-width: 1025px) {
    display: none;
  }
`;
export const Ellipse = styled.img`
  position: absolute;
  right: -100px;
  top: 0px;
  width: 650px;
  height: 650px;
  z-index: -100;
`;
