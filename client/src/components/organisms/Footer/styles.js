import styled, { css } from "styled-components";

export const Footer = styled.footer`
  padding: 2em;
`;
export const Menu = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10em;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2em;
  }
`;

export const MenuTitle = styled.h3``;
export const MenuList = styled.ul``;
export const MenuItem = styled.li`
  list-style-type: none;
  display: flex;
  flex-direction: column;
`;
export const MenuLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: black;
`;
export const MenuText = styled.p`
  line-height: 150%;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
`;
export const MenuInput = styled.input`
  width: 250px;
  padding: 1em;
  border-radius: 20px;
`;
export const MenuHeader = styled.h4`
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background-image: linear-gradient(
    90deg,
    rgba(11, 138, 253, 1) 0%,
    rgba(197, 118, 255, 1) 25%
  );
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
`;

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2em;
  grid-column-gap: 3em;
  ${(props) =>
    !props.grid &&
    css`
      grid-template-columns: 1fr;
    `}
`;
