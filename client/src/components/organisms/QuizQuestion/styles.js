import styled, { css } from "styled-components";

export const ProgressBar = styled.h2`
  font-size: 20px;
`;
export const Progress = styled.div`
  width: 90%;
  height: 8px;
  margin: 16px auto 0 0;
  border: 1px solid lightgrey;
  border-radius: 10px;
`;
export const ProgressFill = styled.div`
  width: 0%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
  ${(props) =>
    props.fillPercent &&
    css`
      width: ${props.fillPercent}%;
    `}
`;
export const QuizHeader = styled.div`
  padding-top: 8em;
  width: 90%;
  margin: auto;
`;

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
  justify-content: space-evenly;
  border-radius: 40px;
  padding: 5em 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2em 0;
    width: 95%;
    margin: auto;
  }
`;

export const Title = styled.h1`
  font-size: 40px;
  margin-bottom: 50px;
`;
/* CSS */
export const FancyButton = styled.button`
  white-space: nowrap;
  min-width: 280px;
  color: black;
  cursor: pointer;
  border-radius: 1000px;
  padding: 10px 40px;
  font-size: 20px;
  ${(props) =>
    (props.checked || props.customBackground) &&
    css`
      background-color: black;
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
    background-color: black;
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
    font-size: 18px;

    ${(props) =>
      !props.isSubmit &&
      css`
        min-width: 100px;
      `}
  }
  ${(props) =>
    props.isSubmit &&
    css`
      background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
      &:hover {
        color: black;
      }
    `}
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
export const DateInput = styled.input`
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  margin: 1em 0;
  font-size: 20px;
  display: block;
  min-height: 1.2em;
  ${(props) =>
    props.placeholder === "MM/DD/YYYY" &&
    css`
      :before {
        width: 100%;
        content: attr(placeholder);
      }
    `}
`;
export const InputName = styled.input`
  padding: 0.5em;
  margin-bottom: 1em;
  font-size: 20px;
`;
