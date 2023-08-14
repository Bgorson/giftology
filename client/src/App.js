import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./components/environment/Main/Main";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
ReactGA.initialize("UA-218196758-1");
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <Main />
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
