import React, { useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axios from 'axios';
import auth from '../auth/auth';

function CreateCard(props) {
  const [errorMessage, setErrorMessage] = useState('');

  function handleDelete() {
    props.setPollOptions(props.pollOptions.slice(0, -1));
  }

  function handleAdd() {
    props.setPollOptions((array) => [
      ...array,
      <PollOption index={props.pollOptions.length} />,
    ]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let target = event.target;
    let formData = {};

    for (let i = 0; i < target.length; i++) {
      if (target.elements[i].getAttribute('id') === 'isPrivate') {
        formData[target.elements[i].getAttribute('id')] =
          target.elements[i].checked;
      } else {
        formData[target.elements[i].getAttribute('id')] =
          target.elements[i].value;
      }
    }

    const request = {
      title: formData.title,
      description: formData.description,
      isPrivate: formData.isPrivate,
      pollOptions: [],
      userId: auth.isAuthenticated()
        ? auth.isAuthenticated().user._id
        : undefined,
    };

    for (const element in formData) {
      if (element.includes('pollOption')) {
        if (request.pollOptions.includes(formData[element])) {
          setErrorMessage('Unique poll names only');
          return;
        }
        request.pollOptions.push(formData[element]);
      }
    }

    switch (props.buttonText) {
      case 'Create':
        axios
          .post('/api/poll/create', request)
          .then((response) => {
            document.location.href = '/poll/' + response.data.pollId;
            return <h2>Success! Redirecting...</h2>;
          })
          .catch((err) => setErrorMessage(err.response.data.error));
        break;

      case 'Edit':
        axios
          .post('/api/poll/edit/' + props.poll._id, request, {
            headers: {
              Authorization: 'Bearer ' + auth.isAuthenticated().token,
            },
          })
          .then(() => {
            document.location.href = '/poll/' + props.poll._id;
            return <h2>Success! Redirecting...</h2>;
          })
          .catch((err) => setErrorMessage(err.response.data.error));
        break;

      default:
        break;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Poll Title</label>
      <input
        type="text"
        className="form-control"
        id="title"
        placeholder="Enter Title"
        required={true}
        maxLength="300"
        defaultValue={props.poll && props.poll.title}
      />
      <label htmlFor="description" about="Give more context if needed">
        Description{' '}
      </label>
      <textarea
        className="form-control"
        maxLength="40000"
        id="description"
        rows="3"
        defaultValue={props.poll && props.poll.description}
      />
      <label htmlFor="pollOption"> Poll Options </label>
      {props.pollOptions}
      <div style={{ float: 'right' }}>
        <IconButton
          onClick={handleAdd}
          disabled={props.pollOptions.length === 25}
        >
          {' '}
          <AddCircleIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          disabled={props.pollOptions.length === 2}
        >
          {' '}
          <RemoveCircleIcon fontSize="large" />
        </IconButton>
      </div>
      <br />
      <input
        type="checkbox"
        id="isPrivate"
        className="form-check-input"
        placeholder="Enter Title"
        defaultChecked={false}
      />{' '}
      <label htmlFor="isPrivate" className="form-check-label">
        Private
      </label>
      <br />
      <Button
        style={{ marginTop: '2em' }}
        variant="contained"
        color="secondary"
        type="submit"
      >
        {props.buttonText}
      </Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage} </p>}
    </form>
  );
}

function PollOption(props) {
  return (
    <li key={props.index}>
      <div className="PollOption">
        <input
          type="text"
          className="form-control"
          id={'pollOption' + props.index}
          placeholder="Enter Option Name "
          required={true}
          defaultValue={props.value}
        />
      </div>
    </li>
  );
}

export { CreateCard, PollOption };
