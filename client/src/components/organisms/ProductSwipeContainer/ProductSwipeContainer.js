import React, { useState, useRef, useMemo, useEffect } from "react";
import { Audio } from "react-loader-spinner";
import styled, { keyframes } from "styled-components";

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

function ProductSwipeContainer({
  data: originalData,
  handleFetchGPTResults,
  requestController,
}) {
  console.log("CONTROLLER", requestController);

  const [data, setData] = useState(originalData);
  const [altData, setAltData] = useState([]);
  console.log("data", data);
  console.log("alt", altData);
  const [activeStack, setActiveStack] = useState("main");
  const [animateStates, setAnimateStates] = useState([]);
  const [totalSwiped, setTotalSwiped] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(data.length - 1);
  const [isFetching, setIsFetching] = useState(false);
  const [moreLikeThis, setMoreLikeThis] = useState([]);
  const [lessLikeThis, setLessLikeThis] = useState([]);
  const formatGPTResponse = (res) => {
    const responseTemplate = {
      productName: "",
      directImageSrc: "",
      productUrl: "",
      productDescription: "",
      productPrice: "",
      productRating: "",
      productReviews: "",
      productCategory: "",
      productID: "",
    };
  };
  useEffect(() => {
    if (data.length <= 0 && activeStack === "main") {
      setActiveStack("alt");
      setCurrentIndex(altData.length - 1);
    } else if (altData.length <= 0 && activeStack === "alt") {
      setActiveStack("main");
      setCurrentIndex(data.length - 1);
    }
    console.log("ACTIVE STACK", activeStack);
  }, [data, altData]);

  useEffect(() => {
    handleFetchGPTResults({ moreLikeThis, lessLikeThis }).then((res) => {
      console.log("RES", res);
      setData([...data, ...res]);
      setIsFetching(false);
    });
  }, []);

  // const canGoBack = currentIndex < data.length - 1;

  const canSwipe = currentIndex >= 0;

  const swipe = async (dir, currentProduct, stack) => {
    setTotalSwiped(totalSwiped + 1);
    if (stack === "main") {
      if (dir === "left") {
        setLessLikeThis([...lessLikeThis, currentProduct]);
      } else if (dir === "right") {
        setMoreLikeThis([...moreLikeThis, currentProduct]);
      }
      // const updatedData = data.slice(0, -1);
      setData(data.slice(1));
      setCurrentIndex(currentIndex - 1);
      if (data.length <= 1) {
        requestController.abort();
        return;
      }
      if (totalSwiped > 2 && !isFetching) {
        setTotalSwiped(0);
        setIsFetching(true);
        setMoreLikeThis([]);
        setLessLikeThis([]);
        handleFetchGPTResults({ moreLikeThis, lessLikeThis }).then((res) => {
          setAltData([...altData, ...res]);
          setIsFetching(false);
        });
      }
    } else if (stack === "alt") {
      if (dir === "left") {
        setLessLikeThis([...lessLikeThis, currentProduct]);
      } else if (dir === "right") {
        setMoreLikeThis([...moreLikeThis, currentProduct]);
      }
      //remove last item from altData
      // const updatedAltData = altData.slice(0, -1);
      setAltData(altData.slice(1));
      setCurrentIndex(currentIndex - 1);
      if (altData.length <= 1) {
        requestController.abort();
        return;
      }
      if (totalSwiped > 2 && !isFetching) {
        setTotalSwiped(0);
        setIsFetching(true);
        setMoreLikeThis([]);
        setLessLikeThis([]);
        handleFetchGPTResults({ moreLikeThis, lessLikeThis }).then((res) => {
          setData([...data, ...res]);
          setIsFetching(false);
        });
      }
    }
  };

  return (
    <div>
      <>
        <h1>React Tinder Card</h1>
        <CardContainer>
          {data.length > 0 &&
            activeStack === "main" &&
            data
              .map(
                (product, index) =>
                  product.productName && (
                    <StyledTinderCard
                      animate={animateStates[index]}
                      key={product.productName}
                    >
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
                      {/* 
                  <ButtonContainer>
                    <button
                      style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
                      onClick={() =>
                        swipe("left", product.productName, activeStack)
                      }
                    >
                      Swipe left!
                    </button>
                    <button
                      style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
                      onClick={() =>
                        swipe("right", product.productName, activeStack)
                      }
                    >
                      Swipe right!
                    </button>
                  </ButtonContainer> */}
                    </StyledTinderCard>
                  )
              )
              .reverse()}
          {altData.length > 0 &&
            activeStack === "alt" &&
            altData
              .map((product, index) => (
                <StyledTinderCard
                  animate={animateStates[index]}
                  key={`${product.productName} ${Math.random()}`}
                >
                  {product.directImageSrc ? (
                    <>
                      <p>{product.productName}</p>

                      <MainImage src={product.directImageSrc} />
                    </>
                  ) : (
                    <p>{product.productName}</p>
                  )}

                  <ButtonContainer>
                    <button
                      style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
                      onClick={() =>
                        swipe("left", product.productName, activeStack)
                      }
                    >
                      Swipe left!
                    </button>
                    <button
                      style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
                      onClick={() =>
                        swipe("right", product.productName, activeStack)
                      }
                    >
                      Swipe right!
                    </button>
                  </ButtonContainer>
                </StyledTinderCard>
              ))
              .reverse()}
        </CardContainer>
      </>
    </div>
  );
}
export default ProductSwipeContainer;
