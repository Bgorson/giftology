import styled from 'styled-components';

export const FlavorText = styled.p`
  padding-top: 0.5em;
  margin: 0;
  font-size: 1em;
`;

export const CardContainer = styled.div`
  color: black;
  padding: 5px 1em;
  border: 1px solid grey;
  border-radius: 2em;
  cursor: pointer;
  color: black;
  &:hover {
    box-shadow: 10px 10px #ededed;
  }
  @media (max-width: 768px) {
    flex-basis: auto;
  }
`;

export const CardContentContainer = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 155px;
`;

export const ImageWrapper = styled.div`
  height: 350px;

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
