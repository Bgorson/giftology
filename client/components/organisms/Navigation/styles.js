import styled from "styled-components";

export const Navbar = styled.nav`
  background-color: '#f5f5f5';
  margin: 0;
  max-height:170px;
`;

export const Container = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
`;

export const NavItem = styled.li`
  display: inline-block;
  &:first-child {
    /* margin-right: auto; */
  }
  list-style-type: none;
`;
export const Logo = styled.img`
  max-width: 400px;
  margin-right:15em;
  cursor: pointer;

`;
export const NavLink = styled.a`
  color: black;
  display: block;
  line-height: 3em;
  padding: 1em 2em;
  text-decoration: none;
  font-size:18px;
`;
export const ActionItems = styled.div`
  align-self: center;
  flex-wrap: nowrap;

  width: 100%;
`;
export const EmptyDiv = styled.div`
`;
