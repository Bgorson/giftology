import React from "react";
import styled from "styled-components";
import { HeartFill } from "react-bootstrap-icons";

const UpdatedFav = styled(HeartFill)`
  fill: white;
  stroke: #646464;
  stroke-width: 1px;
  width: 25px;
  height: 25px;
`;
const UpdatedSelectedFav = styled(HeartFill)`
  fill: red;
  stroke: #646464;
  stroke-width: 1px;
  width: 25px;
  height: 25px;
`;
export const AddToFavorites = ({ filled }) => {
  return <>{filled ? <UpdatedSelectedFav /> : <UpdatedFav color="white" />}</>;
};
