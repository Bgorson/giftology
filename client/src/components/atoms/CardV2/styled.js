import styled from 'styled-components';

export const FlavorText = styled.p`
  padding-top: 0.5em;
  font-size: 1.2em;
`;

export const CardContainer = styled.div`
  color: black;
  padding: 0 1em;
  flex-basis: 30%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: auto;

  cursor: pointer;
  color: black;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-basis: auto;
  }
`;

export const CardContentContainer = styled.div`
  min-height: 100px;
  text-align: left;
`;

export const ImageWrapper = styled.div`
  min-height: 399px;

  @media (max-width: 768px) {
    border: none;
  }
  width: 100%;

  img {
    margin: auto;
    object-fit: scale-down;
    height: 350px;

    width: 100%;
  }
`;
