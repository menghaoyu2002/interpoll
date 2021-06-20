import { React, useState, useEffect } from 'react';
import { totalVoteCount, mostPopularOption } from '../utils/VoteUtils';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import VoteResult from './VoteResults';

let key = 0;
export default function VoteCard(props) {
  const vote = props.vote;
  const [poll, setPoll] = useState(null);
  let totalVotes = 0;
  const voteResults = [];

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios
      .get('/api/poll/' + vote.pollId, { cancelToken: source.token })
      .then((response) => setPoll(response.data))
      .catch((err) => console.log(err.message));

    return function () {
      source.cancel('Cleaning up async requests');
    };
  }, [vote]);

  if (!poll) {
    return <br></br>;
  } else {
    totalVotes = totalVoteCount(poll);
    poll.pollOptions.forEach((option) => {
      const optionVoteCount =
        option.userVotes.length + option.annonymousVotes.length;
      const votePercentage = (optionVoteCount / totalVotes) * 100;

      voteResults.push(
        <li key={poll._id + key}>
          <VoteResult
            votePercentage={votePercentage}
            optionVoteCount={optionVoteCount}
            optionName={option.optionName}
          />
        </li>
      );
      key += 1;
    });
  }

  return (
    <Paper elevation={3} className="VoteCard">
      <div>
        <h2 style={{ marginBottom: '0.5em' }}>
          <Link to={'/poll/' + poll._id}>{poll.title}</Link>
        </h2>
        <p>
          {' '}
          {props.username} voted for: {vote.optionName}
        </p>
        <p>Most people voted for: {mostPopularOption(poll)}</p>
        <p>Total Votes: {totalVotes} </p>
      </div>
      <ul style={{ width: '100%' }}>{voteResults}</ul>
    </Paper>
  );
}
