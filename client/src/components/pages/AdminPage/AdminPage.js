import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { loginUser } from '../../../api/login';

const AdminPage = ({ setToken }) => {
  const history = useHistory();

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser({ username, password });
      if (user.user.username === 'giftology') {
        setToken(true);
        // store the user in localStorage
        localStorage.setItem('user', JSON.stringify(user.user));
        history.push('/portal');
      }
    } catch (err) {
      alert('Incorrect Login');
    }
  };
  return (
    <>
      <h1>Admin Portal</h1>
      <form>
        <label htmlFor="UserName">UserName:</label>
        <input
          type="text"
          id="UserName"
          name="Userame"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="Password">Password:</label>
        <input
          type="password"
          id="Password"
          name="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={(e) => handleLogin(e)}>Login</button>
      </form>
    </>
  );
};

export default AdminPage;

/*
Basic design:
When a user logs in- set a flag that allows them to access the dataBase table
Login logic-
Enter Username/password- return confirmation token and set flag in Main
As long as state is Main, allow user to view that page
Have backend be the true checker for authentication

In the backend- protect all routes related to posting and deleting products with "withAuth"
If a user loses their authenticated privs, then 

*/
