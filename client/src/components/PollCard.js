import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import auth from '../auth/auth';
import '../styles/PollCard.css';
import { Paper, Button } from '@material-ui/core';
import formateTimeDifference from '../utils/DateUtils';
import { totalVoteCount } from '../utils/VoteUtils';
import VoteResult from './VoteResults';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

let key = 0;
export default function PollCard(props) {
  const currentUser = auth.isAuthenticated();
  const isAuthor =
    currentUser &&
    props.poll.author &&
    currentUser.user._id === props.poll.author._id;
  const [syntheticVote, setSyntheticVote] = useState('');
  const [showResults, setShowResults] = useState(false);
  const poll = props.poll;

  let totalOptionVoteCount = 0;
  poll.pollOptions.forEach((option) => {
    totalOptionVoteCount +=
      option.userVotes.length + option.annonymousVotes.length;
  });

  function handleDelete() {
    axios
      .delete('/api/poll/delete', {
        headers: { Authorization: 'Bearer ' + currentUser.token },
        data: { pollId: poll._id, userId: currentUser.user._id },
      })
      .then(() => (document.location.href = '/'))
      .catch((err) => console.log(err));
  }

  const pollOptions = poll.pollOptions.map((option) => {
    key += 1;
    return (
      <PollOption
        key={key}
        option={option}
        showResults={showResults}
        setShowResults={setShowResults}
        totalOptionVoteCount={totalOptionVoteCount}
        syntheticVote={syntheticVote}
        setSyntheticVote={setSyntheticVote}
      />
    );
  });

  const description = decodeHtml(poll.description);

  return (
    <Paper elevation={3} variant="elevation" className="PollCard">
      <div className="PollCardHeader">
        <h2>
          {' '}
          <Link to={'/poll/' + poll._id}>{poll.title} </Link>
        </h2>
        {isAuthor && (
          <div>
            <Button color="secondary" onClick={handleDelete}>
              <DeleteIcon size="large" />
            </Button>
            <Button>
              <Link to={'/poll/edit/' + poll._id}>
                <EditIcon color="primary" size="large" />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <p>
        Created by{' '}
        {poll.author ? (
          <Link to={'/user/' + poll.author.username}>
            {poll.author.username}
          </Link>
        ) : (
          'Annonymous'
        )}{' '}
        {formateTimeDifference(new Date(poll.uploadDate))}{' '}
      </p>{' '}
      {props.maxCharCount < poll.description.length ? (
        <p>
          {' '}
          {description.slice(0, props.maxCharCount)} ...{' '}
          <Link to={'/poll/' + poll._id}>Read More</Link>{' '}
        </p>
      ) : (
        <p> {description} </p>
      )}
      <ul> {pollOptions} </ul>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setShowResults(!showResults)}
      >
        {' '}
        {showResults ? 'Hide' : 'Show'} Results
      </Button>
      <p className="VoteCount">
        Total Votes: {totalVoteCount(poll) + (syntheticVote ? 1 : 0)}
      </p>
    </Paper>
  );
}

function PollOption(props) {
  async function handleVote() {
    const isAuthenticated = auth.isAuthenticated();
    const response = await axios({
      method: 'post',
      url: '/api/poll/vote',
      data: {
        pollId: props.option.pollId,
        userId: isAuthenticated ? isAuthenticated.user._id : undefined,
        optionName: props.option.optionName,
      },
    }).catch((err) => console.log(err));

    if (response) {
      props.setSyntheticVote(props.option.optionName);
      props.setShowResults(true);
    }
  }

  const optionVoteCount =
    props.option.userVotes.length +
    props.option.annonymousVotes.length +
    (props.syntheticVote === props.option.optionName ? 1 : 0);
  const votePercentage = Math.round(
    (optionVoteCount /
      (props.totalOptionVoteCount + (props.syntheticVote !== '' ? 1 : 0))) *
      100
  );
  return (
    <li>
      {props.showResults ? (
        <VoteResult
          votePercentage={votePercentage}
          optionVoteCount={optionVoteCount}
          optionName={props.option.optionName}
        />
      ) : (
        <button className="VoteButton" onClick={handleVote}>
          {props.option.optionName}
        </button>
      )}
    </li>
  );
}

function decodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
