import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import Main from './components/environment/Main/Main';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
ReactGA.initialize('UA-218196758-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Main />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
