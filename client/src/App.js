import "./App.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./components/environment/Main/Main";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import CookieConsent, {
  getCookieConsentValue,
  Cookies,
} from "react-cookie-consent";
const queryClient = new QueryClient();

function App() {
  const handleAcceptCookie = () => {
    ReactGA.initialize("G-14VR6SM3L7");
  };
  const handleDeclineCookie = () => {
    //remove google analytics cookies
    Cookies.remove("_ga");
    Cookies.remove("_gat");
    Cookies.remove("_gid");
  };
  useEffect(() => {
    const isConsent = getCookieConsentValue();
    if (isConsent === "true") {
      handleAcceptCookie();
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <Main />
          <CookieConsent
            onDecline={handleDeclineCookie}
            enableDeclineButton
            onAccept={handleAcceptCookie}
          >
            This website uses cookies to enhance the user experience.
          </CookieConsent>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
