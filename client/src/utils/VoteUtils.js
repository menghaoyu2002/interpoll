function totalVoteCount(poll) {
  let totalVotes = 0;
  poll.pollOptions.forEach((option) => {
    totalVotes += option.userVotes.length;
    totalVotes += option.annonymousVotes.length;
  });
  return totalVotes;
}

function mostPopularOption(poll) {
  let max = 0;
  let maxname;
  poll.pollOptions.forEach((option) => {
    if (max < option.userVotes.length + option.annonymousVotes.length) {
      maxname = option.optionName;
    }
  });
  return maxname;
}
export { totalVoteCount, mostPopularOption };
