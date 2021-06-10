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

export const getFullDate = (ISODate) => {
  const date = DateTime.fromISO(ISODate);
  date.setLocale("es");
  const fullDate = date.toLocaleString(DateTime.DATE_FULL);
  return fullDate;
};

export const getFullDateWithHour = (ISODate) => {
  const date = DateTime.fromISO(ISODate);
  date.setLocale("es");
  const fullDate = date.toLocaleString(DateTime.DATE_FULL);
  const fullHour = date.toLocaleString(DateTime.TIME_24_SIMPLE);
  return `${fullDate} a las ${fullHour}`;
};
