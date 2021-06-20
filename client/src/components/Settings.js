import React, { useEffect, useState } from 'react';
import { Paper, Button, Divider } from '@material-ui/core';
import SettingsPopUp from './SettingsPopUp';
import axios from 'axios';
import auth from '../auth/auth';
import '../styles/Settings.css';

export default function Settings(props) {
  const [user, setUser] = useState(null);
  const isAuthenticated = auth.isAuthenticated();
  const [changeUsername, setChangeUsername] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get('/api/user/' + props.match.params.username)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => console.log(err));
  }, [props]);

  function handleSubmit(event, attributeName) {
    event.preventDefault();
    axios
      .post(
        '/api/user/update',
        {
          updatedElement: {
            [attributeName]: event.target.changedElement.value,
          },
          userId: user._id,
          email: user.email,
          password: event.target.password.value,
        },
        { headers: { Authorization: 'Bearer ' + isAuthenticated.token } }
      )
      .then((response) => {
        auth.authenticate(response.data);
        console.log(response);
        document.location.href =
          '/user/settings/' + response.data.user.username;
      })
      .catch((err) => setErrorMessage(err.response.data.error));
  }

  function handleDelete(event) {
    event.preventDefault();
    axios
      .delete('/api/user/delete', {
        data: {
          userId: user._id,
          email: event.target.changedElement.value,
          password: event.target.password.value,
        },
        headers: { Authorization: 'Bearer ' + isAuthenticated.token },
      })
      .then(() => {
        sessionStorage.clear();
        document.location.href = '/';
      })
      .catch((err) => setErrorMessage(err.response.data.error));
  }

  if (!user) {
    return <p className="EmptyMessage">No User Found</p>;
  } else if (!isAuthenticated || user._id !== isAuthenticated.user._id) {
    return <p className="EmptyMessage">Unauthorized access to user settings</p>;
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '1em' }}>
      {changeUsername && (
        <SettingsPopUp
          setChangePrompt={setChangeUsername}
          changeElement="Username"
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}{' '}
      {changeEmail && (
        <SettingsPopUp
          setChangePrompt={setChangeEmail}
          changeElement="Email"
          handleSubmit={handleSubmit}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      )}
      {changePassword && (
        <SettingsPopUp
          setChangePrompt={setChangePassword}
          changeElement="Password"
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
      {isDelete && (
        <SettingsPopUp
          setChangePrompt={setDelete}
          changeElement="Delete"
          handleSubmit={handleDelete}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
      <Paper className="UserDataContainer">
        <h2>Settings</h2>
        <div>
          <Divider />
          <div>
            <p>Username: {user.username} </p>{' '}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setChangeUsername(true)}
            >
              Change Username
            </Button>
          </div>
          <Divider />
          <div>
            <p>Email: {user.email} </p>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setChangeEmail(true)}
            >
              Change Email
            </Button>
          </div>
          <Divider />

          <Button
            style={{ margin: '2em 0' }}
            variant="contained"
            color="secondary"
            onClick={() => setChangePassword(true)}
          >
            Change Password
          </Button>
          <br />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDelete(true)}
          >
            {' '}
            Delete User{' '}
          </Button>
        </div>
      </Paper>
    </div>
  );
}
