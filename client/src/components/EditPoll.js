import React, { useEffect, useState } from 'react';
import { Paper } from '@material-ui/core';
import { CreateCard, PollOption } from './CreateCard';
import axios from 'axios';
import auth from '../auth/auth';

export default function EditPoll(props) {
  const [pollOptions, setPollOptions] = useState([]);
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    axios.get('/api/poll/' + props.match.params.pollId).then((response) => {
      const optionsList = [];
      let index = 0;
      setPoll(response.data);
      response.data.pollOptions.forEach((option) => {
        optionsList.push(
          <PollOption value={option.optionName} index={index} />
        );
        index += 1;
      });
      setPollOptions(optionsList);
    });
  }, [props]);

  if (!poll) {
    return <p className="EmptyMessage">No Poll Found</p>;
  } else if (
    !auth.isAuthenticated() ||
    auth.isAuthenticated().user._id !== poll.author._id
  ) {
    return (
      <p className="EmptyMessage"> Unauthorized attempt to edit this post</p>
    );
  }

  console.log(poll);

  return (
    <Paper className="CreatePoll">
      <h2>Edit Poll</h2>
      <p className="WarningText">
        Warning: Editing the poll will reset all votes
      </p>
      <CreateCard
        poll={poll}
        pollOptions={pollOptions}
        setPollOptions={setPollOptions}
        buttonText={'Edit'}
        handleSubmit={null}
      />
    </Paper>
  );
}
