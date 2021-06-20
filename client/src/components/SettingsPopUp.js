import React from 'react';
import { Button, Paper } from '@material-ui/core';
import '../styles/Settings.css';

export default function SettingsPopUp(props) {
  let type = 'text';
  switch (props.changeElement) {
    case 'Email':
      type = 'email';
      break;

    case 'Password':
      type = 'password';
      break;

    case 'Delete':
      type = 'email';
      break;

    default:
      type = 'text';
      break;
  }
  return (
    <div>
      <div
        className="SettingsPopUpContainer"
        onClick={() => {
          props.setChangePrompt(false);
          props.setErrorMessage('');
        }}
      />
      <Paper className="SettingsPopUp">
        <form
          onSubmit={(event) =>
            props.handleSubmit(event, props.changeElement.toLowerCase())
          }
        >
          <label htmlFor="changeElement">
            {props.changeElement !== 'Delete'
              ? 'New ' + props.changeElement
              : 'Email'}
          </label>
          <input
            required={true}
            minLength={type === 'password' ? '6' : '2'}
            type={type}
            id="changedElement"
            className="form-control"
          />
          <label htmlFor="password"> Current Password </label>
          <input
            required={true}
            type="password"
            id="password"
            className="form-control"
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: '1em' }}
            type="submit"
          >
            Confirm
          </Button>
        </form>
        <p style={{ marginTop: '1.5em', color: 'red' }}>
          {' '}
          {props.errorMessage}{' '}
        </p>
      </Paper>
    </div>
  );
}
