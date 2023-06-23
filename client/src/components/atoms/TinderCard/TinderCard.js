import styled, { keyframes } from "styled-components";

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

// Need to know when to apply the animation

const TinderCard = ({ children, handleSwipe }) => {
  return (
    <div>
      <Card url={product.directImageSrc}>
        <h3>{product.productName}</h3>
      </Card>
    </div>
  );
};

export default TinderCard;
