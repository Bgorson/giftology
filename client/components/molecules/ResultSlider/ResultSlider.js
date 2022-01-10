import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import {
  Category,
  CategoryContainer,
  CategoryDescription,
  CategoryScore,
  Container,
  FullContainer,
  ProductContainer,
  ProductImage,
  ProductTitle,
  ProductScore,
  ProductText,
  SingleProductContainer,
} from './styled';
import 'swiper/css/navigation';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

export default function ResultSlider({ categoryScores, arrayOfCategories }) {
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '"> </span>';
    },
  };

  return (
    <Container>
      {categoryScores.map((category, index) => (
        <FullContainer key={index}>
          <CategoryContainer key={index}>
            <Category>{category.name}</Category>
            <CategoryDescription>
              {
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut nisl mattis, scelerisque arcu eget, auctor orci. In arcu turpis.'
              }
            </CategoryDescription>
            {/* <CategoryImage src="/images/default-profile.png" /> */}
            <CategoryScore>Score: {category.score}</CategoryScore>
          </CategoryContainer>
          <div className="container">
            <div className="wrapper">
              <Swiper
                breakpoints={{
                  // when window width is >= 640px
                  640: {
                    width: 640,
                    slidesPerView: 1,
                  },
                  // when window width is >= 768px
                  768: {
                    width: 768,
                    slidesPerView: 3,
                  },
                }}
                modules={[Navigation, Pagination]}
                navigation={true}
                spaceBetween={30}
                pagination={pagination}
                className="mySwiper"
              >
                {arrayOfCategories[category.name].map((product, index) => (
                  <SwiperSlide key={index}>
                    <SingleProductContainer>
                      <ProductImage
                        dangerouslySetInnerHTML={{ __html: product.htmlTag }}
                      />
                      <ProductTitle>{product.productName}</ProductTitle>
                      <ProductText>{product.flavorText},</ProductText>
                      <ProductScore>Score: {product.score}</ProductScore>
                    </SingleProductContainer>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </FullContainer>
      ))}
    </Container>
  );
}
