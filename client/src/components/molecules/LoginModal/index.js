import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Login from "../LoginButton";
import CloseIcon from "../../../close.svg";
import {
  TextContainer,
  DesktopWrapper,
  ModalClose,
  ModalHeading,
} from "./styles";

export default function LoginModal(props) {
  const { handleClose, open } = props;
  return (
    <Dialog
      disableScrollLock={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DesktopWrapper>
        <ModalClose onClick={() => handleClose()} src={CloseIcon} />
        <TextContainer>
          <ModalHeading>Login to save your favorites!</ModalHeading>
          <Login renderButton={true} modalAction={handleClose} />
        </TextContainer>
      </DesktopWrapper>
    </Dialog>
  );
}
