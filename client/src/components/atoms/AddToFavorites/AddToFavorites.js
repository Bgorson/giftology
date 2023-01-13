import React from "react";
import { Heart } from "react-bootstrap-icons";
import { HeartFill } from "react-bootstrap-icons";
export const AddToFavorites = ({ filled }) => {
  return (
    <>
      <span className="mr-2">Add to Favourites</span>
      {filled ? <HeartFill color="red" /> : <Heart />}
    </>
  );
};
