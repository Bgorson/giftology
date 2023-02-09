import styled from "styled-components";

export const Navbar = styled.nav`
  margin: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  position: fixed;
  margin: auto;
  background: white;
  z-index: 100;
  @media (max-width: 768px) {
    position: relative;
  }
`;

export const Container = styled.ul`
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: space-between;
  width: 90%;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const NavItem = styled.li`
  &:first-child {
    /* max-height:170px; */

    /* margin-right: auto; */
  }
  list-style-type: none;
`;
export const LogoNavItem = styled.li`
  list-style-type: none;

  @media (max-width: 768px) {
  }
`;

export const Logo = styled.div`
  cursor: pointer;
`;

export const LogoText = styled.h1`
  font-size: 20px;
  text-transform: uppercase;
  margin: 18px 0 23px 0px;
  @media (max-width: 768px) {
    margin-left: 20px;
  }
`;
export const NavLink = styled.a`
  color: black;
  padding: 0 40px;
  white-space: nowrap;
  display: block;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    color: #44a2bb;
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    padding-top: 0;
    padding-bottom: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`;
export const ActionItems = styled.div`
  display: flex;
  justify-content: center;
  padding: 23px 0 25px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 25px 0px;
    justify-content: left;
    align-self: flex-start;
  }
`;
