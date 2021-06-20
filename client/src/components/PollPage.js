import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PollCard from './PollCard';
import '../styles/PollPage.css';
import { Button, Divider } from '@material-ui/core';
import auth from '../auth/auth';
import CommentCard from './CommentCard';

export default function PollPage(props) {
  const isAuthenticated = auth.isAuthenticated();
  const [poll, setPoll] = useState();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios
      .get('/api/poll/' + props.match.params.pollId, {
        cancelToken: source.token,
      })
      .then((response) => {
        let poll = response.data;
        setPoll(poll);
        setComments(
          poll.comments.map((comment) => {
            return (
              <li className="RootComment" key={comment._id}>
                <CommentCard comment={comment} recurseTree={true} />
                <Divider />
              </li>
            );
          })
        );
      })
      .catch((err) => console.log(err));

    return function () {
      source.cancel('Cleaning up async requests');
    };
  }, [props.match.params.pollId]);

  function handleComment(event) {
    event.preventDefault();
    axios
      .post(
        '/api/poll/' + poll._id + '/comment',
        {
          userId: isAuthenticated.user._id,
          commentBody: event.target.comment.value,
        },
        { headers: { Authorization: 'Bearer ' + isAuthenticated.token } }
      )
      .then(() => (window.location.href = window.location))
      .catch((err) => console.log(err));
  }

  if (!poll) {
    return <p className="EmptyMessage"> Poll Not Found</p>;
  }

  return (
    <div className="PollPage">
      {' '}
      <PollCard poll={poll} />
      <form onSubmit={handleComment}>
        <label htmlFor="comment">
          {isAuthenticated ? 'Post a comment' : 'Login to comment'}
        </label>
        <textarea
          className="form-control"
          required={true}
          maxLength="40000"
          id="comment"
          rows="3"
          disabled={!auth.isAuthenticated()}
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          style={{ margin: '2em 0' }}
          disabled={!auth.isAuthenticated()}
        >
          Comment
        </Button>
      </form>
      <h2>Comments and Discussion</h2>
      <Divider />
      <div>
        <ul>{comments}</ul>
      </div>
    </div>
  );
}
