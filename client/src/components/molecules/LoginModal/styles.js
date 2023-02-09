import styled from "styled-components";

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: 16px;
  margin-left: 2em;
`;
export const Image = styled.img`
  object-fit: contain;
  max-width: 600px;
  max-height: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ProductTitle = styled.h1`
  font-size: 26px;
  font-weight: bold;
`;
export const ProductDescription = styled.p`
  font-size: 16px;
`;
export const ProductPrice = styled.div``;
export const ProductTags = styled.div``;
export const Button = styled.button``;

export const DesktopWrapper = styled.div`
  display: block;
`;

export const ProductDescriptionHeading = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
export const FancyButton = styled.button`
  background-color: inherit;
  white-space: nowrap;
  min-width: 280px;
  color: black;
  cursor: pointer;
  border-radius: 1000px;
  padding: 0.5em;
  font-size: 20px;

  &:focus {
  }

  &:after {
  }
  &:active {
  }

  &:hover {
    background-color: #44a2bb;
    color: white;
  }
  @media (max-width: 768px) {
    background-color: #44a2bb;
    color: white;
    min-width: 100%;
  }
`;

export const ModalClose = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-left: auto;
  align-self: center;
`;
export const ModalHeading = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ModalMain = styled.section`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;

  > .overlay {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  > .content {
    position: relative;
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    width: 70%;
    max-height: 90%;
    min-height: 200px;
    overflow-y: auto;
    z-index: 1;
    text-align: center;

    img {
      max-width: 100%;
    }

    > .close-modal {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 1.2rem;

      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
  }

  &.small > .content {
    max-width: 600px;
  }
`;
