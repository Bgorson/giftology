import React, { useContext } from "react";
import styled from "styled-components";
import { GoogleLogin } from "react-google-login";
import GoogleButton from "react-google-button";

import { loginUser } from "../../../api/login";
const clientId =
  "1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com";
import { UserContext } from "../../../context/UserContext";
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

function Login({ modalAction, renderButton }) {
  const { loggedIn } = useContext(UserContext);

  const onSuccess = async (res) => {
    const response = await loginUser(res.tokenId);
    loggedIn({ token: response.token, email: response.user.email });
    localStorage.setItem("userEmail", response.user.email);

    if (modalAction) {
      modalAction();
    }
  };
  const onFailure = (res) => {
    console.log("failed to login: ", res);
    if (modalAction) {
      modalAction();
    }
  };
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        render={(renderProps) =>
          renderButton ? (
            <GoogleButton onClick={renderProps.onClick} />
          ) : (
            <CustomButton onClick={renderProps.onClick}>Login</CustomButton>
          )
        }
      />
    </div>
  );
}
export default Login;
