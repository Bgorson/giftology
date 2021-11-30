import styled, { css } from "styled-components";

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

/* CSS */
export const FancyButton = styled.button`
  background-color: #3dd1e7;
  border: 0 solid #e5e7eb;
  border-radius: 1em;
  box-sizing: border-box;
  color: #000000;
  display: flex;
  font-size: 1rem;
  justify-content: center;
  line-height: 1.75rem;
  padding: 0.75rem 1.65rem;
  position: relative;
  text-align: center;
  text-decoration: none #000000 solid;
  text-decoration-thickness: auto;
  width: 100%;
  max-width: 460px;
  position: relative;
  cursor: pointer;
  /* transform: rotate(-2deg); */
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:focus {
    outline: 0;
  }

  &:after {
    content: "";
    position: absolute;
    border: 1px solid #000000;
    border-radius: 1em;
    bottom: 4px;
    left: 4px;
    width: calc(100% - 1px);
    height: calc(100% - 1px);
  }

  &:hover:after {
    bottom: 2px;
    left: 2px;
  }

  @media (min-width: 768px) {
    padding: 0.75rem 3rem;
    font-size: 1.25rem;
  }
`;

export const FancyText = styled.div`
  color: hsl(0, 0%, 60%);
  margin-left: 14px;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: 15px;

  transition: 0.3s;
  ${(props) =>
    props.checked &&
    css`
      color: hsl(0, 0%, 40%);
    `}
`;

export const FancyLabel = styled.label`
  display: flex;
  align-items: center;

  border-radius: 100px;
  padding: 14px 16px;
  margin: 0;

  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: hsla(0, 0%, 80%, 0.14);
  }
`;

export const FancyDesign = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 100px;

  background: linear-gradient(
    to right bottom,
    hsl(154, 97%, 62%),
    hsl(225, 97%, 62%)
  );
  position: relative;
  &:before {
    content: "";

    display: inline-block;
    width: inherit;
    height: inherit;
    border-radius: inherit;

    background: hsl(0, 0%, 90%);
    transform: scale(1.1);
    transition: 0.3s;
    ${(props) =>
      props.checked &&
      css`
        transform: scale(0);
        background: none;
      `}
  }
`;
export const FancyRadioButton = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  z-index: -1;
  &:checked {
    transform: scale(0);
    color: hsl(0, 0%, 40%);
  }
`;
