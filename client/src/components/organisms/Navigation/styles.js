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
    display: none;
    flex-direction: column;
    padding: 25px 0px;
    justify-content: left;
    align-self: flex-start;
  }
`;
export const HamburgerMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: relative;
    width: 30px;
    height: 25px;
    margin-right: 15px;
    cursor: pointer;
    margin-bottom: 2em;

    & span {
      position: absolute;
      width: 100%;
      height: 3px;

      background-color: #333;

      border-radius: 3px;
      transition: all 0.3s ease-in-out;
    }
    & span:nth-child(1) {
      top: 0;
      left: 0;
    }
    & span:nth-child(2) {
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
    & span:nth-child(3) {
      bottom: 0;
      left: 0;
    }
    &.open span:nth-child(1) {
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
    &.open span:nth-child(2) {
      opacity: 0;
    }
    &.open span:nth-child(3) {
      bottom: 50%;
      transform: translateY(50%) rotate(-45deg);
    }
  }
`;

export const HamburgerIcon = styled.div`
  width: 30px;
  height: 3px;
  background-color: #333;
  margin: 6px 0;
  @media (max-width: 768px) {
    width: 30px;
    height: 3px;
    background-color: #333;
    margin: 6px 0;
  }
`;

export const MobileMenu = styled.div`
  display: block;
`;
