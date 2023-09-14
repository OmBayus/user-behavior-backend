export const convertTimeStampToHourAndMinuteAndSecs = (time: number) => {
  const date = new Date(time);
  let hours: number | string = date.getHours();
  let mins: number | string = date.getMinutes();
  let secs: number | string = date.getSeconds();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (mins < 10) {
    mins = `0${mins}`;
  }

  if (secs < 10) {
    secs = `0${secs}`;
  }

  return `${hours}:${mins}:${secs}`;
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


export const convertMicrosecondsToHourAndMinuteAndSeconds = (time:number)=>{
  let hours: number | string = Math.floor(time / 3600000);
  let mins: number | string = Math.floor(time / 60000);
  let secs: number | string = ((time % 60000) / 1000).toFixed(0);

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (mins < 10) {
    mins = `0${mins}`;
  }

  if (Number(secs) < 10) {
    secs = `0${secs}`;
  }

  return `${hours}:${mins}:${secs}`;
}

export const dateConverter = (tarih: any) => {
  const ayIsimleri = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const gun = tarih.getDate();
  const ay = ayIsimleri[tarih.getMonth()];
  const yil = tarih.getFullYear();
  return `${ay} ${gun}, ${yil}`;
}