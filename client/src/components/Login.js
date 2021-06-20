import axios from 'axios';
import React, { useState } from 'react';
import auth from '../auth/auth';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import { Card, Button } from '@material-ui/core';

function Login() {
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleLogin(event) {
    event.preventDefault();
    axios
      .post('/api/user/login', {
        email: event.target.email.value,
        password: event.target.password.value,
      })
      .then((response) => {
        auth.authenticate(response.data);
        document.location.href = '/';
      })
      .catch((err) => setErrorMessage(err.response.data.error));
  }

  return (
    <Card variant="elevation" className="Login">
      <h1> Login </h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            required={true}
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
          />
        </div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          required={true}
          type="password"
          id="password"
          className="form-control"
        />
        <Link to="/user/register">Don't have an account? Register Here!</Link>{' '}
        <br></br>
        <Button variant="outlined" color="secondary" type="submit">
          Login
        </Button>
      </form>
      <p> {errorMessage} </p>
    </Card>
  );
}

export default Login;
