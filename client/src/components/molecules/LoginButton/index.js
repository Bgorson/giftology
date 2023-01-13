import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { loginUser } from "../../../api/login";
const clientId =
  "1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com";
import { UserContext } from "../../../context/UserContext";

function Login({ modalAction }) {
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
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
      />
    </div>
  );
}
export default Login;
