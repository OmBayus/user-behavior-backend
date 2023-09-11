export const convertTimeStampToHourAndMinute = (time: number) => {
  let mins: number | string = new Date(time).getMinutes();

  let secs: number | string = new Date(time).getSeconds();

  if (mins < 10) {
    mins = `0${mins}`;
  }

  if (secs < 10) {
    secs = `0${secs}`;
  }

  return `${mins}:${secs}`;
};

export const convertMinuteToHourAndMinute = (time: number) => {
  let hours: number | string = Math.floor(time / 60);
  let mins: number | string = time % 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (mins < 10) {
    mins = `0${mins}`;
  }

  return `${hours}:${mins}`;
};


export const convertMicrosecondsToMinuteAndSeconds = (time:number)=>{
  let mins: number | string = Math.floor(time / 60000);
  let secs: number | string = ((time % 60000) / 1000).toFixed(0);

  if (mins < 10) {
    mins = `0${mins}`;
  }

  if (Number(secs) < 10) {
    secs = `0${secs}`;
  }

  return `${mins}:${secs}`;
}