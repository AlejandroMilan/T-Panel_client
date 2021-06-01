import numeral from "numeral";

export const currencyFormat = (number) => {
  return numeral(number).format("$0,0.00");
};
