import styled, { css } from 'styled-components';

export const BirthdayGift = styled.div`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 170px;
    height: 20px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
    top: 90px;
    left: -10px;
  }
`;
export const ClickLabel = styled.label`
  position: absolute;
  background-color: #e9c46a;
  width: 170px;
  height: 40px;
  top: -40px;
  left: -10px;
  transform-origin: bottom left;
  transition: 0.3s;
  cursor: pointer;
  &:before {
    content: '';
    position: absolute;
    width: 25px;
    height: 40px;
    background-color: #e76f51;
    left: 69px;
  }
  &:after {
    content: '';
    position: absolute;
    width: 5px;
    height: 0;
    border-bottom: 30px solid #e76f51;
    border-top: 30px solid #e76f51;
    border-left: 0px solid transparent;
    border-right: 30px solid transparent;
    transform: rotate(-90deg);
    left: 65px;
    top: -47px;
  }
`;
export const Click = styled.input`
  display: none;

  ${(props) =>
    props.checked &&
    css`
      transform: rotate(-110deg) scaleX(0.85);
    `}
`;
export const Gift = styled.div`
  position: relative;
  width: 150px;
  height: 100px;
  background-color: #e9c46a;
  &:before {
    content: '';
    position: absolute;
    width: 25px;
    height: 100px;
    background-color: #e76f51;
    left: 62px;
  }
  &:after {
    content: '';
    position: absolute;
    box-shadow: inset 0 10px rgba(0, 0, 0, 0.3);
    width: 150px;
    height: 100px;
  }
`;
export const Wishes = styled.div`
  position: absolute;
  transition: 0.5s;
  color: #333;
  font-size: 37px;
  text-align: center;
  z-index: -1;
  left: 5px;
  transform: translateY(-100px);
`;
export const Sparkles = styled.div``;
export const SparkOne = styled.div``;
export const SparkTwo = styled.div``;
export const SparkThree = styled.div``;
export const SparkFour = styled.div``;
export const SparkFive = styled.div``;
export const SparkSix = styled.div``;
