import React, { createContext, useState } from 'react';

const defaultValue = {
  isLoggedIn: false,
  userEmail: '',
  name: '',
  token: '',
};

const UserContext = createContext({ ...defaultValue });
const UserConsumer = UserContext.Consumer;
const UserProvider = (props) => {
  const { children } = props;
  const loggedIn = ({ token }) => {
    setState({ isLoggedIn: true, token: token });
  };
  const loggedOut = () => {
    setState({ isLoggedIn: false });
  };
  const [state, setState] = useState(defaultValue);
  const actions = {
    loggedIn,
    loggedOut,
  };
  React.useEffect(() => {
    setState(defaultValue);
  }, []);
  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserConsumer, UserProvider };
