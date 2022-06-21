import styled, { css } from 'styled-components';

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5em;
  flex-wrap: wrap;
  max-width: 900px;
  justify-content: center;
  @media (max-width: 768px) {
    width: 98%;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: lightgray;
  justify-content: space-evenly;
  border-radius: 40px;
  padding: 5em 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2em 0;
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 1em;
`;
/* CSS */
export const FancyButton = styled.button`
  /* background-color: #44a2bb; */
  background-color: inherit;
  white-space: nowrap;
  min-width: 280px;
  color: black;
  cursor: pointer;
  border-radius: 1000px;
  padding: 0.5em;
  font-size: 20px;
  ${(props) =>
    props.checked &&
    css`
      background-color: #44a2bb;
      color: white;
    `}
  ${(props) =>
    props.isSlider &&
    css`
      width: fit-content;
    `}

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
  ${(props) =>
    props.isMulti &&
    css`
      margin-top: 1em;
      width: fit-content;

      background-color: black;
      color: white;
    `}
  @media (max-width: 768px) {
    ${(props) =>
      !props.isSubmit &&
      css`
        min-width: 30%;
      `}
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
    content: '';

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
export const DateInput = styled.input`
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  margin: 1em 0;
  font-size: 20px;
  display: block;
  min-height: 1.2em;
  ${(props) =>
    props.placeholder === 'MM/DD/YYYY' &&
    css`
      :before {
        width: 100%;
        content: attr(placeholder);
      }
    `}
`;
