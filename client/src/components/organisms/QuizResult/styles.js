import styled from 'styled-components';

export const Disclosure = styled.h1`
  font-size: 1em;
`;
export const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Link = styled.a`
  font-size: 1em;
  margin: 1em;
  text-align: center;
`;
export const Title = styled.h1`
  font-size: 3em;
  margin: 1em;
  text-align: center;
`;

export const LoaderContainer = styled.div`
  width: 100%;
  padding: 2em 0;
  text-align: center;
  & > div {
    justify-content: center;
    padding-top: 1em;
  }
  @media (max-width: 768px) {
    padding-top: 0;
  }
`;
