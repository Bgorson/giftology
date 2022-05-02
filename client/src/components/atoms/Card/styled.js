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
  text-align: left;
`;

export const ImageWrapper = styled.div`
  min-height: 399px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    border: none;
  }
`;
