import '../styles/PollCard.css';

export default function VoteResult(props) {
  const votePercentage = isNaN(props.votePercentage) ? 0 : props.votePercentage;

  return (
    <div className="ResultContainer">
      {votePercentage !== 0 ? (
        <div
          className="VoteResult"
          style={{
            width: Math.max((votePercentage / 100) * 90, 0) + '%',
          }}
        >
          {props.optionName}
        </div>
      ) : (
        <div className="EmptyVote">{props.optionName}</div>
      )}
      <p className="VoteStats">
        {props.optionVoteCount} Vote{props.optionVoteCount !== 1 && 's'}{' '}
        <br></br>
        {votePercentage}%
      </p>
    </div>
  );
}
