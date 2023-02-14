import styled, { css } from "styled-components";

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
  font-size: 34px;
`;
export const ProductDescription = styled.p`
  font-size: 16px;
`;
export const ProductPrice = styled.div`
  margin: 0 24px 0 auto;
  font-size: 32px;
`;
export const ProductTags = styled.div`
  display: flex;
  padding-top: 40px;
  gap: 1em;
  @media (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 2em;
  }
`;
export const Button = styled.button``;
export const ProductImage = styled.div``;
export const MobileWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;
export const DesktopWrapper = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ProductDescriptionHeading = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
export const FancyButton = styled.button`
  background-color: inherit;
  white-space: nowrap;
  color: black;
  cursor: pointer;
  padding: 12px 24px;
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
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
      background-color: grey;
      &:hover {
        background-color: grey;
        color: black;
      }
    `}
  ${(props) =>
    props.isPurchase &&
    css`
      background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
      border: 1px solid rgba(0, 0, 0, 0.15);
      &:hover {
        background-color: grey;
        color: black;
      }
    `}
`;

export const ModalClose = styled.img`
  padding: 30px 30px 0 0;
  width: 12px;
  height: 12px;
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
export const ButtonContainer = styled.div`
  display: flex;
  gap: 1em;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
  padding-bottom: 2em;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const Tag = styled.div`
  border: 1px solid grey;
  width: fit-content;
  padding: 12px 20px;
`;
