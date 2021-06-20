module.exports.PollOption = class PollOption {
  constructor(optionName, pollId, pollTitle) {
    this.optionName = optionName;
    this.userVotes = [];
    this.annonymousVotes = [];
    this.pollId = pollId;
    this.pollTitle = pollTitle;
  }
};
