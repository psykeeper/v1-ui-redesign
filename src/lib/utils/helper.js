import BigNumber from "bignumber.js";
import moment from "moment-timezone";

export const fromWei = (amount, decimal = 18) => {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimal));
};

export const toWei = (amount, decimal = 18) => {
  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimal));
};

export const toTimezoneFormat = (timestamp) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment.unix(timestamp).tz(timezone).format("YYYY/MM/DD h:mm A") + " (" + timezone + ")";
};

export const printNode = (...args) => {
  const strArray = args[0].split("%s");
  let output = [];
  strArray.forEach((elem, index) => {
    if (index === strArray.length - 1) output.push(<span key={index}>{elem}</span>);
    else output.push(...[<span key={index}>{elem}</span>, <span key={`arg${index}`}>{args[index + 1]}</span>]);
  });
  return output;
};

export const printf = (...args) => {
  const strArray = args[0].split("%s");
  let output = [];
  strArray.forEach((elem, index) => {
    if (index === strArray.length - 1) output.push(elem);
    else output.push(...[elem, args[index + 1]]);
  });
  return output.join("");
};


export const compareBigNum = (a, b) => (new BigNumber(a).gt(b) ? 1 : new BigNumber(a).lt(b) ? -1 : 0);

export const compare = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
