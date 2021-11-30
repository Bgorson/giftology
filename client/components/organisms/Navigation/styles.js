import styled from "styled-components";

export const Navbar = styled.nav`
  margin: 0;
`;

export const Container = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const NavItem = styled.li`
  &:first-child {
    /* max-height:170px; */

    /* margin-right: auto; */
  }
  list-style-type: none;
`;
export const Logo = styled.img`
  width: 400px;
  cursor: pointer;
`;
export const NavLink = styled.a`
  color: black;
  display: block;
  line-height: 3em;
  padding: 1em 2em;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    color: #44a2bb;
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    white-space:nowrap;
    padding-top: 0;
    padding-bottom: 0;

  }
`;
export const ActionItems = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  flex-basis: 50%;
  margin-top: 2em;
  width: 100%;
  @media (max-width: 768px) {
    /* flex-direction: column; */
    margin: 0;
  }
`;
