import React from "react";
import { Footer } from "./styles";

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <Footer>
      <p>{`Copyright Ⓒ ${year}. All Rights Reserved`}</p>
    </Footer>
  );
}
