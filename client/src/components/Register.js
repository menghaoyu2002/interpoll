import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card } from '@material-ui/core';
import '../styles/Register.css';

export default function Register() {
  const [errorMessage, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    if (event.target.password.value !== event.target.confirmPassword.value) {
      setError('Passwords do not match');
      return;
    }
    await axios
      .post('/api/user/register', {
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
      })
      .then(() => setRedirect(true))
      .catch((err) => setError(err.response.data.error));
  }

  if (redirect) {
    return <Redirect to="/user/login" />;
  }

  return (
    <Card className="Register">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email"> Email </label>
          <input
            required={true}
            type="email"
            id="email"
            placeholder="name@example.com"
            className="form-control"
          />
        </div>
        <label htmlFor="username">Username </label>
        <input
          required={true}
          minLength="2"
          maxLength="32"
          type="text"
          id="username"
          className="form-control"
        />
        <label htmlFor="password">Password </label>
        <input
          required={true}
          minLength="6"
          type="password"
          id="password"
          className="form-control"
        />
        <label htmlFor="password">Confirm Password </label>
        <input
          required={true}
          minLength="6"
          type="password"
          id="confirmPassword"
          className="form-control"
        />
        <button className="SubmitButton" type="submit">
          SIGN UP
        </button>
        <p style={{ color: 'red', marginTop: '1em' }}>{errorMessage}</p>
      </form>
    </Card>
  );
}
