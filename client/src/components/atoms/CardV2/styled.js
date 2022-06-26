import styled from 'styled-components';

export const FlavorText = styled.p`
  padding-top: 0.5em;
  font-size: 1.2em;
`;

export const CardContainer = styled.div`
  color: black;
  width: 350px;
  flex-basis: 30%;
  display: flex;
  flex-direction: column;
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
  max-width: 350px;
  width: 100%;
  img {
    object-fit: scale-down;
    height: 500px;
    width: 500px;
    max-width: 100%;
  }
`;
