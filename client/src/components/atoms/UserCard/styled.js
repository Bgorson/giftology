import styled, { css,keyframes } from "styled-components";


export const CardContainer = styled.div`
 opacity: ${props => (props.isHidden ? 0 : 1)};
  transition: opacity 0.5s;
border-radius: 25px;
  align-items:center;
  color: black;
  position: relative;
  height: 510px;

  cursor: pointer;
  color: black;
  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 768px) {
    flex-basis: auto;
  }
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

export const CardHeader= styled.p`
  `
export const Arrow  = styled.img`
width: 75%;
`

export const CardContainerEffective
= styled.div`
  display: flex;
  padding: 8px;
  height:100%;
  justify-content: space-around;
  text-align: center;
  flex-direction: column;

`;
export const CardContentContainer = styled.div`
  position: relative;
  text-align: left;
  display: flex;
  padding: 8px;
  justify-content: space-between
  text-align: center;
  flex-direction: column;
    & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
export const CardBackContentContainer = styled.div`
  text-align: left;
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: space-between;
`;

export const ImageWrapper = styled.div`
  height: 350px;
  border-radius: 25px 25px 0 0;
  @media (max-width: 768px) {
    border: none;
  }
  width: 100%;

  img {
    margin: auto;
    height: 350px;
    object-fit: scale-down;

    width: 100%;
  }
`;
export const SubTextContainer = styled.div``;
export const BadgeContainer = styled.div`
  overflow: inherit !important;
  position: absolute;
  z-index: 60;
  top: -50px;
  right: 5px;
  background-color: #44a2bb;
  border-radius: 33%;
  color: white;
  padding: 5px;
`;
export const BadgeText = styled.p`
  margin: 0;
`;
export const FavoriteContainer = styled.div`
  position: absolute;
  z-index: 60;
  top: 50px;
  right: 20px;
  width: 30px;
  height: 30px;
`;

export const Image = styled.img`
  width: 100%;
  border-radius: 25px 25px 0 0;

`;
export const ProductDescriptionHeading = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;
export const ProductDescription = styled.p`
  font-size: 16px;
`;
export const ProductTags = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const Tag = styled.p`
  margin-top: 0;
`;
export const ButtonContainer = styled.div`
  display:flex;
  width: 100%;
  align-items: center;
  flex-wrap:wrap;
  gap:1em;
  justify-content: center;
`;
export const TopButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;
export const MassButtons = styled.button`
border-radius: 1.5em;
background-color: inherit;
white-space: nowrap;
color: black;
cursor: pointer;
font-size: 16px;
border: 1px solid black;


&:focus {
}

&:after {
}
&:active {
}

&:hover {
}
`
export const FancyButton = styled.button`
  border-radius: 1.5em;
  width: 150px;
  background-color: inherit;
  white-space: nowrap;
  margin: 4em auto;
  color: black;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid black;
  

  &:focus {
  }

  &:after {
  }
  &:active {
  }

  &:hover {

  }

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
      background-color: grey;
      &:hover {
        background-color: grey;
        color: black;
      }
    `}
  ${(props) =>
    props.isPurchase &&
    css`
      background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
      border: 1px solid rgba(0, 0, 0, 0.15);
      &:hover {
        background-color: grey;
        color: black;
      }
    `}
`;
export const Button = styled.button``;
export const ProductPrice = styled.div`
  margin: 0 24px 0 auto;
  font-size: 18px;
`;

export const CardBackContainer = styled.div`
border-radius: 25px;
  color: black;
  position: relative;
  height: 510px;

  cursor: pointer;
  color: black;
  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 768px) {
    flex-basis: auto;
  }
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;
