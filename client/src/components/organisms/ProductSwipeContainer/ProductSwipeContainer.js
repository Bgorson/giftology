import React, { useState, useRef, useMemo, useEffect } from "react";
import { Audio } from "react-loader-spinner";
import styled, { keyframes } from "styled-components";

const CardContainer = styled.div`
  width: 90vw;
  max-width: 260px;
  height: 300px;
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

const StyledTinderCard = styled.div`
  animation: ${(props) => (props.animate && popUpAnimation) || "none"};
  animation-duration: 800ms;
  position: absolute;
`;

const InfoText = styled.h2`
  width: 100%;
  justify-content: center;
  display: flex;
  color: red;
  animation-name: popUpAnimation;
  animation-duration: 800ms;
`;

function ProductSwipeContainer({ data: originalData, handleFetchGPTResults }) {
  const [data, setData] = useState(originalData);
  const [animateStates, setAnimateStates] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(data.length - 1);
  const [lastDirection, setLastDirection] = useState();
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
  // used for outOfFrame closure

  // const canGoBack = currentIndex < data.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    console.log(currentIndex);
    console.log("swiped", direction);
    if (direction === "left") {
      setLessLikeThis([...lessLikeThis, nameToDelete]);
    } else if (direction === "right") {
      setMoreLikeThis([...moreLikeThis, nameToDelete]);
    }
    if (currentIndex < 50 && !isFetching) {
      setIsFetching(true);
      setMoreLikeThis([]);
      setLessLikeThis([]);
      handleFetchGPTResults({ moreLikeThis, lessLikeThis }).then((res) => {
        setData(res.concat(data));
        // set index to previous index plus the length of the new data
        // setCurrentIndex(currentIndex + res.length);
        // setData([...data, ...res]);
        setIsFetching(false);
      });
    }
    setLastDirection(direction);
    setCurrentIndex(index - 1);
  };

  const swipe = async (dir, currentIndex) => {
    console.log("Swiped this card: ", data[currentIndex]);
    console.log("in this direction: ", dir);
  };

  const handleButtonClick = (index) => {
    const updatedStates = [...animateStates];
    updatedStates[index] = true;
    setAnimateStates(updatedStates);
  };

  return (
    <div>
      <>
        <h1>React Tinder Card</h1>
        <CardContainer>
          {data.map((product) => (
            <StyledTinderCard
              animate={animateStates[index]}
              key={product.productName}
            />
          ))}
        </CardContainer>

        {lastDirection ? (
          <InfoText>You swiped {lastDirection}</InfoText>
        ) : (
          <InfoText>
            Swipe a card or press a button to get Restore Card button visible!
          </InfoText>
        )}
        <div className="buttons">
          <button
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("left")}
          >
            Swipe left!
          </button>
          {/* <button
            style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
            onClick={() => goBack()}
          >
            Undo swipe!
          </button> */}
          <button
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("right")}
          >
            Swipe right!
          </button>
        </div>
      </>
    </div>
  );
}
export default ProductSwipeContainer;
