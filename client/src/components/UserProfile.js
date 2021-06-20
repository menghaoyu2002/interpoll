import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Paper, Tabs, Tab, Button } from '@material-ui/core';
import PollCard from './PollCard';
import VoteCard from './VoteCard';
import CommentCard from './CommentCard';
import '../styles/UserProfile.css';
import { Redirect } from 'react-router-dom';

let key = 0;
export default function UserProfile(props) {
  const [user, setUser] = useState(null);
  const [value, setValue] = useState(0);
  const createdPolls = [];
  const commentHistory = [];
  const voteHistory = [];

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios
      .get('/api/user/' + props.match.params.username, {
        cancelToken: source.token,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    return function () {
      source.cancel('Cleaning up async requests');
    };
  }, [props.match.params.username]);

  if (!user) {
    return (
      <p className="EmptyMessage">
        No user found with the username "{props.match.params.username}"{' '}
      </p>
    );
  } else {
    const maxPropLength = Math.max(
      user.createdPolls.length,
      user.commentHistory.length,
      user.pollHistory.length
    );

    for (var i = Math.min(5, maxPropLength) - 1; i >= 0; i--) {
      if (user.createdPolls.length > i) {
        user.createdPolls[i].author = user;
        createdPolls.push(
          <li key={user.createdPolls[i]._id}>
            <PollCard maxCharCount={1000} poll={user.createdPolls[i]} />
          </li>
        );
      }

      if (user.commentHistory.length > i) {
        commentHistory.push(
          <li key={user.commentHistory[i]._id}>
            <Paper elevation={3} className="CommentContainer">
              <h2>{user.commentHistory[i].pollTitle}</h2>
              <CommentCard
                comment={user.commentHistory[i]}
                maxCharCount={1000}
              />
            </Paper>
          </li>
        );
      }

      if (user.pollHistory.length > i) {
        voteHistory.push(
          <li key={user._id + key}>
            <VoteCard vote={user.pollHistory[i]} username={user.username} />
          </li>
        );
        key += 1;
      }
    }
  }

  return (
    <div>
      <h1 className="UserName"> {user.username} </h1>
      <Paper className="AppBar">
        <Tabs
          value={value}
          onChange={(_, value) => setValue(value)}
          indicatorColor="primary"
          textColor="primary"
          centered
          scrollButtons="auto"
        >
          <Tab label="Created Polls" />
          <Tab label="Vote History" />
          <Tab label="Comment History" />
        </Tabs>
      </Paper>
      <div className="UserStats">
        {value === 0 &&
          (createdPolls.length !== 0 ? (
            <ul style={{ marginLeft: '-2em' }}>
              {createdPolls}{' '}
              <li>
                {' '}
                <SeeAllButton username={user.username} address="polls" />{' '}
              </li>
            </ul>
          ) : (
            <p className="EmptyMessage"> No Polls by {user.username} </p>
          ))}
      </div>
      <div className="UserStats">
        {value === 1 &&
          (voteHistory.length !== 0 ? (
            <div>
              <ul style={{ marginLeft: '-2em' }}>
                {voteHistory}
                <li>
                  <SeeAllButton username={user.username} address="votes" />
                </li>
              </ul>
            </div>
          ) : (
            <p className="EmptyMessage">
              {user.username} has not participated in any polls
            </p>
          ))}
      </div>
      <div className="UserStats">
        {value === 2 &&
          (commentHistory.length !== 0 ? (
            <ul style={{ marginLeft: '-2em' }}>
              {commentHistory}{' '}
              <li>
                <SeeAllButton username={user.username} address="comments" />
              </li>
            </ul>
          ) : (
            <p className="EmptyMessage"> No comments by {user.username}</p>
          ))}
      </div>
    </div>
  );
}

function SeeAllButton(props) {
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to={'/user/' + props.username + '/' + props.address} />;
  }

  return (
    <Button
      color="secondary"
      variant="contained"
      style={{ margin: 'auto', marginTop: '1em', width: '100%' }}
      onClick={() => setRedirect(true)}
    >
      See All
    </Button>
  );
}
