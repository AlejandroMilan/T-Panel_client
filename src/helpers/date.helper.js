import { DateTime } from "luxon";

export const getShortDate = (ISODate) => {
  const date = DateTime.fromISO(ISODate);
  const year = date.year;
  let month = date.month;
  if (month < 10) month = `0${month}`;
  let day = date.day;
  if (day < 10) day = `0${day}`;

  const shortDate = `${day}/${month}/${year}`;
  return shortDate;
};
