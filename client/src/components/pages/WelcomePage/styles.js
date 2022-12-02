import styled from 'styled-components';

export const HeroImage = styled.img`
  /* aspect-ratio: auto 2304 / 1142; */
  width: 100%;
  box-shadow: 5px 5px #ededed;
  border-radius: 2em;
`;
export const Hero = styled.div`
  position: relative;
  width: 95%;
  margin: auto;
`;

export const HeroCallToAction = styled.div`
  font-size: 36px;
  text-decoration: underline;
  color: black;
  &:hover {
    color: #44a2bb;
  }
  @media (max-width: 1025px) {
    font-size: 32px;
  }
`;
export const HeroDescription = styled.p`
  font-size: 24px;
  color: white;
  font-family: 'Slabo13px-Regular';
  margin-bottom: 43px;
  @media (max-width: 1025px) {
    margin-bottom: 1em;
    color: black;
  }
`;
export const HeroTitle = styled.h1`
  font-family: 'FiraSansCondensed-Black';
  font-weight: bold;
  font-size: 36px;
  color: white;
  margin-bottom: 43px;
  margin-top: 0;
  @media (max-width: 1025px) {
    margin-bottom: 1em;
    color: black;
    font-size: 32px;
  }
`;
export const HeroText = styled.div`
  font-family: 'FiraSansCondensed-Black';
  margin-right: 2em;
  position: absolute;
  top: 38%;
  left: 50%;

  @media (max-width: 1025px) {
    margin-right: 0;
    position: relative;
    left: 0;
    top: 0;
  }
`;
