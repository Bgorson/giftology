import React, { createContext, useState } from "react";
import { getUser } from "../api/user";

const defaultValue = {
  isLoggedIn: false,
  email: "",
  name: "",
  token: "",
};

const UserContext = createContext({ ...defaultValue });
const UserConsumer = UserContext.Consumer;
const UserProvider = (props) => {
  const { children } = props;
  const loggedIn = ({ token, email }) => {
    console.log("FROM LOG IN", token);
    localStorage.setItem("token", token);
    setState({ isLoggedIn: true, token: token, email: email });
  };
  const loggedOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("userEmail", "");

    setState({ isLoggedIn: false });
  };
  const attempToLogin = async (token) => {
    console.log("attemptig");
    return await getUser(token);
  };

  const [state, setState] = useState(defaultValue);
  const actions = {
    loggedIn,
    loggedOut,
  };
  React.useEffect(() => {
    console.log("use effect running");
    if (localStorage.getItem("token")) {
      console.log("here");
      const token = localStorage.getItem("token");
      attempToLogin(token).then((data) => {
        console.log("DATA", data);
        localStorage.setItem("userEmail", data?.email);

        setState({ ...data, token: token, isLoggedIn: true });
      });
    } else {
      setState(defaultValue);
    }
  }, []);
  console.log("STATE", state);
  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserConsumer, UserProvider };
