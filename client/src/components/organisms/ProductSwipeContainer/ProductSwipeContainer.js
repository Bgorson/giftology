import React, { useState, useEffect } from "react";
import { Audio } from "react-loader-spinner";
import styled, { keyframes } from "styled-components";
import Card from "../../atoms/CardV3";
import { postAmazonProductInfo } from "../../../api/postAmazonProductInfo";

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const popUpAnimation = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ButtonContainer = styled.div``;
const StyledTinderCard = styled.div`
  background-color: white;
  width: 300px;
  height: 300px;
  max-width: 300px;
  max-height: 300px;
  animation: ${(props) => (props.animate && popUpAnimation) || "none"};
  animation-duration: 800ms;
`;

const InfoText = styled.h2`
  margin: 0;
`;

const MainImage = styled.img`
  width: 100%;
  height: 200px;
  max-height: 200px;
  object-fit: cover;
`;

function ProductSwipeContainer({ data: originalData, GPTResults }) {
  console.log("GPTResults", GPTResults);

  return (
    <div>
      <>
        <h1>React Tinder Card</h1>
        <CardContainer>
          {originalData.length > 0 &&
            originalData.map(
              (product, index) =>
                product.productName && (
                  <StyledTinderCard key={product.productName}>
                    {product.directImageSrc ? (
                      <>
                        <p>{product.productName}</p>
                        <a target="_blank" href={product?.link}>
                          <MainImage src={product.directImageSrc} />
                        </a>
                      </>
                    ) : (
                      <p>{product.productName}</p>
                    )}
                  </StyledTinderCard>
                )
            )}
          {GPTResults && <Card GPTResults={GPTResults} />}
        </CardContainer>
      </>
    </div>
  );
}

export default ProductSwipeContainer;
