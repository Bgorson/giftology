import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  SlickContainer,
  Category,
  CategoryContainer,
  CategoryDescription,
  CategoryScore,
  Container,
  CategoryDiv,
  ProductImage,
  ProductTitle,
  ProductScore,
  ProductText,
  SingleProductContainer,
} from './styled';
import ProductCard from '../../atoms/Card';

export default function ResultSlider({ categoryScores, arrayOfCategories }) {
  const [swiped, setSwiped] = React.useState(false);

  const handleSwiped = React.useCallback(() => {
    setSwiped(true);
  }, [setSwiped]);

  const handleOnItemClick = React.useCallback(
    (e) => {
      if (swiped) {
        e.stopPropagation();
        e.preventDefault();
        setSwiped(false);
      }
    },
    [swiped]
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    arrayOfCategories && (
      <Container>
        {categoryScores.map((category, index) => (
          <CategoryDiv key={index}>
            <CategoryContainer key={0}>
              <Category>{category.name}</Category>
              <CategoryDescription>
                {
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut nisl mattis, scelerisque arcu eget, auctor orci. In arcu turpis.'
                }
              </CategoryDescription>
              <CategoryScore>Score: {category.score}</CategoryScore>
            </CategoryContainer>
            <SlickContainer>
              <Slider onSwipe={handleSwiped} {...settings}>
                {arrayOfCategories[category.name].map((product, index) => (
                  //   TODO: FIX THIS
                  //   <a
                  //     key={index}
                  //     onClickCapture={handleOnItemClick}
                  //     href={product.htmlTag
                  //       .match(/(?:"[^"]*"|^[^"]*$)/)[0]
                  //       .replace(/"/g, '')}
                  //     target="_blank"
                  //     rel={'noreferrer'}
                  //   >
                  <ProductCard
                    key={index}
                    onClickCapture={handleOnItemClick}
                    product={product}
                  />
                  //   </a>
                ))}
              </Slider>
            </SlickContainer>
          </CategoryDiv>
        ))}
      </Container>
    )
  );
}
