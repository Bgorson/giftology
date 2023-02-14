import styled from "styled-components";

export const TextDescription = styled.p`
  font-size: 16px;
`;
export const TextHeader = styled.h1`
  font-size: 40px;
`;
export const Container = styled.div`
  margin: auto;
  padding: 15em 0 20em 0;
  display: flex;
  justify-content: space-around;
  @media (max-width: 768px) {
    width: 90%;
    padding: 0;
  }
`;
export const Disclaimer = styled.div`
  text-align: center;
  margin: auto;
  width: 630px;
  line-height: 150%;
  padding: 16px 24px;
  background: rgba(223, 107, 107, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(223, 107, 107, 0.2);
  @media (max-width: 768px) {
    width: 100%;
  }
`;
export const TextContent = styled.div`
  width: 33%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
export const ImageContainer = styled.div`
  position: relative;
  width: 50%;
  @media (max-width: 768px) {
    display: none;
  }
`;
export const ImageOne = styled.img`
  position: absolute;
  top: 25%;
  left: 33%;
  z-index: 1;
`;
export const ImageTwo = styled.img`
  position: absolute;
  bottom: 0%;
  right: 0%;
`;
