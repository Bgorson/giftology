import styled from "styled-components";

export const Navbar = styled.nav`
  margin: 0;
`;

export const Container = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  max-height: 200px;
`;

export const NavItem = styled.li`
  display: inline-block;

  &:first-child {
    /* max-height:170px; */

    /* margin-right: auto; */
  }
  list-style-type: none;
`;
export const Logo = styled.img`
  width: 400px;
  margin-right: 15em;
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
`;
export const ActionItems = styled.div`
  align-self: end;
  flex-wrap: nowrap;
  flex-basis: 33%;

  width: 100%;
`;
export const EmptyDiv = styled.div`
  flex-basis: 33%;
`;
