import { Button, Paper } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import PollCard from './PollCard';
import CommentCard from './CommentCard';
import VoteCard from './VoteCard';
import SearchIcon from '@material-ui/icons/Search';
import '../styles/ShowMore.css';

export default function ShowMore(props) {
  const [user, setUser] = useState(null);
  const [userPolls, setPolls] = useState([]);
  const [userVotes, setVotes] = useState([]);
  const [userComments, setComments] = useState([]);

  useEffect(() => {
    axios.get('/api/user/' + props.match.params.username).then((response) => {
      let user = response.data;
      setUser(user);
      switch (props.match.params.type) {
        case 'polls':
          setPolls(
            user.createdPolls.map((poll) => {
              poll.author = user;
              return (
                <li key={poll._id}>
                  <PollCard maxCharCount={1000} poll={poll} />
                </li>
              );
            })
          );
          break;
        case 'comments':
          setComments(
            user.commentHistory.map((comment) => (
              <li key={comment._id}>
                <Paper>
                  <CommentCard comment={comment} />
                </Paper>
              </li>
            ))
          );
          break;

        case 'votes':
          let key = 0;
          setVotes(
            user.pollHistory.map((vote) => {
              key += 1;
              return (
                <li key={key}>
                  <VoteCard vote={vote} />
                </li>
              );
            })
          );
          break;

        default:
          break;
      }
    });
  }, [props]);

  function handleSearch(event) {
    event.preventDefault();
    const searchFor = event.target.search.value;
    switch (props.match.params.type) {
      case 'polls':
        if (searchFor === '') {
          setPolls(
            user.createdPolls.map((poll) => {
              poll.author = user;
              return (
                <li key={poll._id}>
                  <PollCard maxCharCount={1000} poll={poll} />
                </li>
              );
            })
          );
        } else {
          setPolls(
            user.createdPolls
              .filter((poll) => {
                return poll.title
                  .toLowerCase()
                  .includes(searchFor.toLowerCase());
              })
              .map((poll) => {
                poll.author = user;
                return (
                  <li key={poll._id}>
                    <PollCard maxCharCount={1000} poll={poll} />
                  </li>
                );
              })
          );
        }
        break;

      case 'comments':
        if (searchFor === '') {
          setComments(
            user.commentHistory.map((comment) => (
              <li key={comment._id}>
                <Paper>
                  <CommentCard comment={comment} />
                </Paper>
              </li>
            ))
          );
        } else {
          setComments(
            user.commentHistory
              .filter((comment) => {
                return comment.body
                  .toLowerCase()
                  .includes(searchFor.toLowerCase());
              })
              .map((comment) => (
                <li key={comment._id}>
                  <Paper>
                    <CommentCard comment={comment} />
                  </Paper>
                </li>
              ))
          );
        }
        break;

      case 'votes':
        if (searchFor === '') {
          let key = 0;
          setVotes(
            user.pollHistory.map((vote) => {
              key += 1;
              return (
                <li key={key}>
                  <VoteCard vote={vote} />
                </li>
              );
            })
          );
        } else {
          let key = 0;
          setVotes(
            user.pollHistory
              .filter((vote) => {
                return vote.pollTitle
                  .toLowerCase()
                  .includes(searchFor.toLowerCase());
              })
              .map((vote) => {
                key += 1;
                return (
                  <li key={key}>
                    <VoteCard vote={vote} />
                  </li>
                );
              })
          );
        }
        break;

      default:
        break;
    }
  }

  if (!user) {
    return (
      <h2>There is no user with the username {props.match.params.username}</h2>
    );
  }

  if (!['votes', 'polls', 'comments'].includes(props.match.params.type)) {
    return <h2>Invalid Link: No results for "{props.match.params.type}"</h2>;
  }

  return (
    <div className="ShowMore">
      <h2>
        {' '}
        All {props.match.params.type} by {user.username}
      </h2>
      <form className="input-group" onSubmit={handleSearch}>
        <input
          type="search"
          id="search"
          className="form-control"
          placeholder={'Search for ' + props.match.params.type}
        />

        <Button type="submit" variant="contained" color="primary">
          {' '}
          <SearchIcon />
        </Button>
      </form>
      <div className="DataContainer">
        {props.match.params.type === 'polls' &&
          (userPolls.length > 0 ? (
            <ul>{userPolls}</ul>
          ) : (
            <p className="EmptyMessage">
              {' '}
              {user.username} has not created any polls{' '}
            </p>
          ))}
        {props.match.params.type === 'comments' &&
          (userComments.length > 0 ? (
            <ul>{userComments}</ul>
          ) : (
            <p className="EmptyMessage">
              {' '}
              {user.username} has not commented on any polls{' '}
            </p>
          ))}
        {props.match.params.type === 'votes' &&
          (userVotes.length > 0 ? (
            <ul>{userVotes}</ul>
          ) : (
            <p className="EmptyMessage">
              {' '}
              {user.username} has not participated in any polls{' '}
            </p>
          ))}
      </div>
    </div>
  );
}
