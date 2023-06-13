import React, { useState } from "react";

const SwipeableCard = ({ data }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const dx = event.clientX - position.x;
    const dy = event.clientY - position.y;

    setPosition({ x: event.clientX, y: event.clientY });
    // Perform any additional transformations based on dx and dy

    // Example: Rotate the card slightly based on the horizontal movement
    const card = event.target;
    const rotateValue = Math.min(Math.max(dx / 10, -15), 15);
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotateValue}deg)`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });

    // Reset the card's position and rotation
    const card = document.getElementById("swipeable-card");
    card.style.transform = "translate(0, 0) rotate(0deg)";

    // Trigger a swipe action based on the final position
    // Example: If dx is positive, it's a right swipe; if negative, it's a left swipe
    const dx = event.clientX - position.x;
    if (dx > 50) {
      console.log("Swiped right!");
      // Perform action for right swipe
    } else if (dx < -50) {
      console.log("Swiped left!");
      // Perform action for left swipe
    }
  };

  return (
    <div
      id="swipeable-card"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Render your card content here */}
      <img src={data.image} alt={data.name} />
      <h2>{data.name}</h2>
      <p>{data.description}</p>
    </div>
  );
};

export default SwipeableCard;
