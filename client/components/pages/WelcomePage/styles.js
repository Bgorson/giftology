import styled from 'styled-components';

export const HeroImage = styled.img`
  object-fit: cover;
  width: 100%;
`;
export const Hero = styled.div`
  position: relative;
`;

export const HeroCallToAction = styled.div`
  font-size: 36px;
  text-decoration: underline;
  color: black;
  &:hover {
    color: #44a2bb;
  }
`;
export const HeroDescription = styled.p`
  font-size: 18px;
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;
export const HeroTitle = styled.h1`
  font-weight: bold;
  font-size: 36px;
  color: white;
  margin-bottom: 43px;
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;
export const HeroText = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  @media (max-width: 768px) {
    top: 0;
  }
`;
