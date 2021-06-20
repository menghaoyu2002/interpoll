import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import auth from '../auth/auth';
import '../styles/TopNavBar.css';
import { Button, Paper } from '@material-ui/core';
import UserDrawer from './UserDrawer';
import AddIcon from '@material-ui/icons/Add';

export default function TopNavBar() {
  const [visible, setVisibility] = useState(false);
  const [zoom, setZoom] = useState(Math.round(window.devicePixelRatio * 100));
  window.onresize = () => setZoom(Math.round(window.devicePixelRatio * 100));
  return (
    <div className="Container" onMouseLeave={() => setVisibility(false)}>
      <Paper className="TopNavBarLinkContainer">
        <Link className="SiteName" to="/">
          {zoom >= 250 ? 'InterPoll' : 'InterPoll - The Internet Poll'}
        </Link>
        <div className="LoginLinks">
          <Link to="/poll/create" className="NavLink" aria-current="page">
            <Button color="secondary" variant="contained">
              Create <AddIcon style={{ marginLeft: '0.5em' }} />
            </Button>
          </Link>{' '}
          {auth.isAuthenticated() ? (
            <button className="user" onClick={() => setVisibility(!visible)}>
              {auth.isAuthenticated().user.username}
            </button>
          ) : (
            <span>
              <Link className="NavLink" aria-current="page" to="/user/login">
                <Button variant="outlined">Login</Button>
              </Link>
              <Link to="/user/register" className="NavLink" aria-current="page">
                <Button variant="outlined"> Sign Up </Button>
              </Link>
            </span>
          )}
        </div>
      </Paper>

      {auth.isAuthenticated() && visible ? (
        <div>
          <UserDrawer setVisibility={setVisibility} />
          <div
            className="CloseMenuButton"
            onClick={() => setVisibility(false)}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
