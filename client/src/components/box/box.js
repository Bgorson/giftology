import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

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
  width: 200px;
  height: 200px;
  cursor: pointer;
  transform: translate(-9px, -15px);

  &:hover {
    animation: ${shake} 0.3s infinite alternate;
  }
`;
const CircleContainer = styled.div`
  flex-basis: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2em;
  visibility: ${(props) => (props.out ? 'hidden' : 'visible')};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const fadeIn = keyframes`
  from {
    transform: scale(0.25);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0.25);
    opacity: 0;
  }
`;

export default function ({ product, handleCardClick, id }) {
  const handleClick = (el) => {
    setIsVisible(false);
    setTimeout(() => {
      setFadeIn(false);
    }, 1000);
  };
  const [visible, setIsVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);

  return (
    <>
      <CircleContainer onClick={() => handleClick(`star${id}`)}>
        {visible ? (
          <>
            <Circle src={star}></Circle>
            {'Click me!'}
          </>
        ) : (
          <ProductCard handleCardClick={handleCardClick} product={product} />
        )}
      </CircleContainer>
    </>
  );
}
