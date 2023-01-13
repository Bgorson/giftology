import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { loginUser } from "../../../api/login";
const clientId =
  "1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com";
import { UserContext } from "../../../context/UserContext";

function Login({ modalAction }) {
  const { loggedIn } = useContext(UserContext);

  const onSuccess = async (res) => {
    // console.log('login Successful- Current user:', res.tokenId);
    const response = await loginUser(res.tokenId);
    loggedIn({ token: response.token, email: response.user.email });
    console.log("res", response);
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
        // isSignedIn={true}
      />
    </div>
  );
}
export default Login;

// // In the responseGoogle(response) {...} callback function, you should get back a standard JWT located at response.tokenId or res.getAuthResponse().id_token
// Send this token to your server (preferably as an Authorization header)
// Have your server decode the id_token by using a common JWT library such as jwt-simple or by sending a GET request to https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=YOUR_TOKEN_HERE
// The returned decoded token should have an hd key equal to the hosted domain you'd like to restrict to.
