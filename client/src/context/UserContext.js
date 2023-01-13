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
    localStorage.setItem("token", token);
    setState({ isLoggedIn: true, token: token, email: email });
  };
  const loggedOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("userEmail", "");

    setState({ isLoggedIn: false });
  };
  const attempToLogin = async (token) => {
    if (token) {
      return await getUser(token);
    }
  };

  const [state, setState] = useState(defaultValue);
  const actions = {
    loggedIn,
    loggedOut,
  };
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      attempToLogin(token).then((data) => {
        localStorage.setItem("userEmail", data?.email);

        setState({ ...data, token: token, isLoggedIn: true });
      });
    } else {
      setState(defaultValue);
    }
  }, []);
  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserConsumer, UserProvider };
