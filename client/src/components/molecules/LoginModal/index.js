import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Login from "../LoginButton";
import CloseIcon from "../../../close.png";
import DialogContent from "@mui/material/DialogContent";
import {
  TextContainer,
  DesktopWrapper,
  ModalClose,
  ModalHeading,
} from "./styles";

export default function ScrollDialog(props) {
  const { handleClose, open } = props;
  return (
    <Dialog
      disableScrollLock={true}
      maxWidth={"lg"}
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <ModalClose onClick={() => handleClose()} src={CloseIcon} />

      <DesktopWrapper>
        <DialogContent
          style={{ display: "flex" }}
          dividers={scroll === "paper"}
        >
          <TextContainer>
            <ModalHeading>Login here to view your top gifts!</ModalHeading>
            <Login modalAction={handleClose} />
          </TextContainer>
        </DialogContent>
      </DesktopWrapper>
    </Dialog>
  );
}
