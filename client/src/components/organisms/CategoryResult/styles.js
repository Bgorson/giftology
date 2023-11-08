import styled, { css } from "styled-components";

export const MainSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: 2em auto;
  align-items: center;
  justify-content: center;
  gap: 1em;
  border: lightgray 1px solid;
  @media (min-width: 768px) {
    width: 100%;
  }
`;

export const CategoryTitleCard = styled.h1`
  position: sticky;
  top: 0px;
  width: 100%;
  margin: auto;
  z-index: 999;
  border-radius: 25px;
  text-align: center;
  background: linear-gradient(90deg, #0b8afd 0%, #c576ff 100%);
  @media (min-width: 768px) {
    top: 75px;
  }
`;

export const FancyButton = styled.button`
  border-radius: 1.5em;
  width: 150px;
  background-color: inherit;
  white-space: nowrap;
  margin: 10px 0 0 0;
  color: black;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid black;

  &:focus {
  }

  &:after {
  }
  &:active {
  }

  &:hover {
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

export const ViewMoreCard = styled.div`
  width: 400px;
  margin: auto;
`;
