import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import ReactGA from 'react-ga';

import star from '../../star.png';
import ProductCard from '../atoms/Card';

const testData = {
  _id: '628ba23c7cef8ce8b60969e9',
  productId: 100114,
  productName: 'Little Dove Ball Pit',
  category: 'Exercise',
  website: 'Amazon',
  htmlTag:
    '<a href="https://www.amazon.com/dp/B07X3BB29N?_encoding=UTF8&th=1&linkCode=li3&tag=giftology03-20&linkId=eaa66548b82d846179b520f21f8d3706&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07X3BB29N&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology03-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology03-20&language=en_US&l=li3&o=1&a=B07X3BB29N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
  link: 'https://amzn.to/3vvR63q',
  flavorText: 'Kids. Love. Ball. Pits.',
  productBasePrice: '109.99',
  gender: null,
  indoorOutdoor: null,
  ageMin: '0',
  ageMax: '5',
  occasion: null,
  giftType: ['essentials', 'interestingAndFun'],
  hobbiesInterests: null,
  tags: ['fun'],
  directImageSrc:
    'https://m.media-amazon.com/images/I/71eEzStGgAL._AC_SL1500_.jpg',
  listingId: null,
  ocassion: null,
  score: 1,
};

const shake = keyframes`
    0% { transform: translate(-8px, -14px); }
    33% { transform: translate(-10px, -14px); }
    66% { transform: translate(-10px, -16px); }
    100% { transform: translate(-8px, -16px); }
`;

const Circle = styled.img`
  width: 300px;
  height: 300px;
  cursor: pointer;
  transform: translate(-9px, -15px);

  &:hover {
    animation: ${shake} 0.3s infinite alternate;
  }
`;
const CircleContainer = styled.div`
  flex-basis: 30%;
  border-radius: 3em;
  display: flex;
  min-height: 690px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2em;
  visibility: ${(props) => (props.out ? 'hidden' : 'visible')};
  transition: visibility 1s linear;
  ${(props) =>
    props.visible &&
    css`
      background: #27eaf4;
      background: -webkit-linear-gradient(top left, #27eaf4, #208dc5);
      background: -moz-linear-gradient(top left, #27eaf4, #208dc5);
      background: linear-gradient(to bottom right, #27eaf4, #208dc5);
    `}
`;

export default function ({ product, handleCardClick, id }) {
  const handleClick = () => {
    setIsVisible(false);
    if (visible) {
      ReactGA.event({
        category: 'Star Selected',
        action: product.productName,
      });
    }

    setTimeout(() => {
      setFadeIn(false);
    }, 1000);
  };
  const [visible, setIsVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);

  return (
    <>
      <CircleContainer visible={visible} onClick={() => handleClick()}>
        {visible ? (
          <>
            <Circle src={star}></Circle>
            {'Click me!'}
          </>
        ) : (
          <ProductCard
            isHighlighted={true}
            handleCardClick={handleCardClick}
            product={product}
          />
        )}
      </CircleContainer>
    </>
  );
}
