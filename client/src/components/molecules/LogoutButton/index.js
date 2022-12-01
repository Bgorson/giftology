import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { UserContext } from '../../../context/UserContext';
import { useHistory } from 'react-router-dom';

const clientId = process.env.REACT_APP_CLIENT_ID;
console.log(process.env);
function Logout() {
  const history = useHistory();

  const { loggedOut } = useContext(UserContext);

  const onSuccess = () => {
    console.log('log outSuccessful');
    loggedOut();
    history.push('/');
  };
  //   const onFailure = (res) => {
  //     console.log('failed to login: ', res);
  //   };
  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
        style={{ marginTop: '100px' }}
      />
    </div>
  );
}
export default Logout;
