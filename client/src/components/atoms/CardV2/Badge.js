import * as React from "react";
import Typography from "@mui/material/Typography";
import { BadgeContainer, BadgeText } from "./styled";
export default function Badge({ text }) {
  return (
    // <BadgeContainer>
    <BadgeText>{text}</BadgeText>
    // </BadgeContainer>
  );
}
