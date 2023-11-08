import * as React from "react";
import { BadgeText } from "./styled";
export default function Badge({ text }) {
  return (
    // <BadgeContainer>
    <BadgeText>{text}</BadgeText>
    // </BadgeContainer>
  );
}
