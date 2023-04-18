import styled from "styled-components";

export const FlavorText = styled.p`
  padding-top: 0.5em;
  margin: 0;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.8);
`;

export const CardContainer = styled.div`
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

export const CardContentContainer = styled.div`
  text-align: left;
  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: space-between;
  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ImageWrapper = styled.div`
  height: 350px;
  background-color: #f5f5f5;
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
  background-color: #4896c2;
  text-transform: uppercase;
  color: white;
  font-size: 12px;
  max-width: 150px;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  margin: 0;
  align-self: flex-end;
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
`;
