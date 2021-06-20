import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import '../styles/CreatePoll.css';
import { CreateCard, PollOption } from './CreateCard';

export default function PollForm() {
  const [pollOptions, setPollOptions] = useState([
    <PollOption index={0} />,
    <PollOption index={1} />,
    <PollOption index={2} />,
  ]);

  return (
    <Paper className="CreatePoll">
      <h2>Create a Poll</h2>
      <CreateCard
        pollOptions={pollOptions}
        setPollOptions={setPollOptions}
        buttonText={'Create'}
      />
    </Paper>
  );
}
