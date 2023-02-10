import React, { useContext } from "react";
import styled from "styled-components";

import { GoogleLogout } from "react-google-login";
import { UserContext } from "../../../context/UserContext";
import { useHistory } from "react-router-dom";
const CustomButton = styled.a`
  background: none !important;
  border: none;
  padding: 0 !important;
  text-decoration: underline;
  cursor: pointer;
  white-space: nowrap;
  display: block;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    color: #44a2bb;
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    padding-top: 0;
    padding-bottom: 0;
  }
`;
const clientId =
  "1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com";
function Logout() {
  const history = useHistory();

  const { loggedOut } = useContext(UserContext);

  const onSuccess = () => {
    console.log("log outSuccessful");
    loggedOut();
    history.push("/");
  };
  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        onLogoutSuccess={onSuccess}
        render={(renderProps) => (
          <CustomButton onClick={renderProps.onClick}>Logout</CustomButton>
        )}
      />
    </div>
  );
}
export default Logout;
