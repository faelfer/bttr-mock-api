module.exports = function calendarWithHourAndMinutesMask(dateString) {
  // console.log('calendarWithHourAndMinutesMask | dateString: ', dateString);
  const date = new Date(dateString);
  // console.log('calendarWithHourAndMinutesMask | date: ', date);
  let hours = date.getHours();
  // console.log('calendarWithHourAndMinutesMask | hours: ', hours);
  let minutes = date.getMinutes();
  // console.log('calendarWithHourAndMinutesMask | minutes: ', minutes);
  let day = date.getDate().toString();
  // console.log('calendarWithHourAndMinutesMask | day: ', day);
  let month = (date.getMonth() + 1).toString();
  // console.log('calendarWithHourAndMinutesMask | month: ', month);
  const year = date.getFullYear();
  // console.log('calendarWithHourAndMinutesMask | year: ', year);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${parseInt(minutes, 10)}` : parseInt(minutes, 10);

  day = day.length === 1 ? `0${day}` : day;
  month = month.length === 1 ? `0${month}` : month;

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};
