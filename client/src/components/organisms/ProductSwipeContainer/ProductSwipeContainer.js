import TinderCard from "react-tinder-card";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { Audio } from "react-loader-spinner";
import styled, { keyframes } from "styled-components";

const CardContainer = styled.div`
  width: 90vw;
  max-width: 260px;
  height: 300px;
`;
const Card = styled.div`
  position: relative;
  background-color: #fff;
  color: salmon;
  font-size: 20px;
  width: 80vw;
  max-width: 260px;
  height: 300px;

  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.url});
`;

const StyledTinderCard = styled(TinderCard)`
  position: absolute;
`;
const popUpAnimation = keyframes`
  0%   { transform: scale(1,1) }
  10%  { transform: scale(1.1,1.1) }
  30%  { transform: scale(.9,.9) }
  50%  { transform: scale(1,1) }
  57%  { transform: scale(1,1) }
  64%  { transform: scale(1,1) }
  100% { transform: scale(1,1) }
}
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
  console.log("OG", originalData);
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
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

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
      handleFetchGPTResults({ moreLikeThis, lessLikeThis }).then((res) => {
        console.log("res", res);
        setData([...data, ...res]);
        setIsFetching(false);
      });
    }
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < data.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  return (
    <div>
      <>
        <h1>React Tinder Card</h1>
        <CardContainer>
          {data.map((character, index) => (
            <StyledTinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.productName}
              onSwipe={(dir) => swiped(dir, character.productName, index)}
              onCardLeftScreen={() => outOfFrame(character.productName, index)}
            >
              <Card url={character.directImageSrc}>
                <h3>{character.productName}</h3>
              </Card>
            </StyledTinderCard>
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
