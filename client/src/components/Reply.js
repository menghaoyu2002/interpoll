import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import '../styles/Comment.css';
import auth from '../auth/auth';
import axios from 'axios';

export default function Reply(props) {
  const isAuthenticated = auth.isAuthenticated();

  function handleReply(event) {
    event.preventDefault();
    axios
      .post(
        '/api/comment/' + props.comment._id + '/reply',
        {
          userId: isAuthenticated.user._id,
          commentBody: event.target.reply.value,
        },
        { headers: { Authorization: 'Bearer ' + isAuthenticated.token } }
      )
      .then((document.location.href = document.URL))
      .catch((err) => console.log(err));
  }

  return (
    <form onSubmit={handleReply}>
      {props.writeReply &&
        (isAuthenticated ? (
          <div>
            <label for="reply">Reply to {props.comment.authorName}: </label>
            <textarea
              className="form-control"
              id="reply"
              rows="3"
              placeholder="Reply..."
              style={{ marginBottom: '1em' }}
            />

            <Button variant="contained" color="primary" type="submit">
              Reply
            </Button>
          </div>
        ) : (
          <div>
            <p>
              {' '}
              <Link style={{ textDecoration: 'none' }} to="/user/login">
                Login
              </Link>{' '}
              or{' '}
              <Link style={{ textDecoration: 'none' }} to="/user/register">
                Register
              </Link>{' '}
              to reply to this comment{' '}
            </p>
          </div>
        ))}
    </form>
  );
}
