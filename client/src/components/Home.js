import React, { useEffect, useState } from 'react';
import PollCard from './PollCard';
import axios from 'axios';
import '../styles/Home.css';

function ListItem(props) {
  return (
    <li>
      <PollCard
        poll={props.value}
        maxCharCount={1000}
        setUserVote={props.setUserVote}
      />
    </li>
  );
}

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [errorMessage, setError] = useState('');

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios('/api/home/', { cancelToken: source.token })
      .then((response) => {
        setPolls(response.data);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(err.message);
        } else {
          console.log(err.message);
        }
      });

    return function () {
      source.cancel('Cleaning up async requests');
    };
  }, []);

  const pollListItem = polls.map((poll) => (
    <ListItem key={poll._id} value={poll} />
  ));
  return (
    <div>
      {errorMessage && <p className="EmptyMessage"> {errorMessage} </p>}
      <ul className="PollContainer"> {pollListItem} </ul>
    </div>
  );
}
