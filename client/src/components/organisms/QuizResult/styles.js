import styled from 'styled-components';

export const Disclosure = styled.i`
  font-size: 1em;
  margin:0 1em;
`;
export const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top:6em;
  text-align: center;
  width:95%;
  margin:auto;
  gap:1em;
  padding-bottom:1em;
  @media (max-width: 768px) {
    padding-top: 0;
  width:100%;
  }
`;
export const ResultInfo= styled.p`
font-size:1.5em;
`
export const Link = styled.a`
  font-size: 1em;
  margin: 1em;
  text-align: center;
`;
export const Title = styled.h5`
  font-size: 2em;
  margin:0;
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
