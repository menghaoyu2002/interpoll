export default function formatTimeDifference(uploadDate) {
  let timeDifference = Date.now() - uploadDate.getTime();

  timeDifference = timeDifference / 1000 / 60 / 60;

  let timeFormatted;
  if (timeDifference < 1) {
    timeDifference = timeDifference * 60;
    if (timeDifference < 1) {
      timeDifference = timeDifference * 60;
      timeFormatted = Math.floor(timeDifference) + ' second';
    }
    timeFormatted = Math.floor(timeDifference) + ' minute';
  } else if (timeDifference < 24) {
    timeFormatted = Math.floor(timeDifference) + ' hour';
  } else {
    timeDifference = timeDifference / 24;
    timeFormatted = Math.floor(timeDifference) + ' day';
  }

  return timeFormatted + (Math.floor(timeDifference) !== 1 ? 's' : '') + ' ago';
}
