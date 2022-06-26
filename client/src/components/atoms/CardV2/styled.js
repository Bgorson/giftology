import styled from 'styled-components';

export const FlavorText = styled.p`
  padding-top: 0.5em;
  font-size: 1.2em;
`;

export const CardContainer = styled.div`
  color: black;
  width: 350px;
  flex-basis: 23%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
  @media (max-width: 768px) {
    flex-basis: auto;
  }
`;

export const CardContentContainer = styled.div`
  min-height: 100px;
  text-align: left;
`;

export const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  /* min-height: 200px; */

  @media (max-width: 768px) {
    border: none;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 15.625rem;
  }
`;
