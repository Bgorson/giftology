import styled from 'styled-components';

export const FlavorText = styled.p`
  padding-top: 0.5em;
  font-size: 1.2em;
`;

export const CardContainer = styled.div`
  color: black;
  width: 90%;
  margin: auto;
  overflow: hidden;
`;

export const CardContentContainer = styled.div`
  min-height: 100px;
  text-align: center;
  & div {
    text-align: center !important;
  }
`;

export const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 399px;
  margin: auto;
  @media (max-width: 768px) {
    border: none;
  }
  max-width: 350px;
  width: 100%;
  img {
    max-width: 100%;
  }
`;
