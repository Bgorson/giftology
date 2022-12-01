import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { UserContext } from '../../../context/UserContext';
import { useHistory } from 'react-router-dom';

const clientId =
  '1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com';
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
