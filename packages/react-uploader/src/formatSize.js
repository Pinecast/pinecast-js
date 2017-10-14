/*
This file is based on the pretty-bytes package by @sindresorhus
https://github.com/sindresorhus/pretty-bytes
*/

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default num => {
  if (num < 1) {
    return num + ' B';
  }

  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), UNITS.length - 1);
  const numStr = Number((num / Math.pow(1024, exponent)).toPrecision(3));
  const unit = UNITS[exponent];

  return numStr + ' ' + unit;
};
