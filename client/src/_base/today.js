// @flow

export default function () {
  const date = new Date();
  let month = String(date.getMonth() + 1);
  if (month.length < 2) {
    month = `0${month}`;
  }

  let day = String(date.getDate());
  if (day.length < 2) {
    day = `0${day}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
}
