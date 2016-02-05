/**
 *
 *
 *
 *
 */

function _getQueryStrAsObj(str) {
  // Source: https://css-tricks.com/snippets/jquery/get-query-params-object/
  return str.replace(/(^\?)/, '').split("&").map(function(n) {
    return n = n.split("="), this[n[0]] = n[1], this
  }.bind({}))[0]
}


/**
 *
 *
 *
 *
 */

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}


/**
 *
 *
 *
 *
 */

function getTodayFormatted() {
  var today = new Date();

  var day = padToTwoDigits(today.getDate() + 1);
  var month = padToTwoDigits(today.getMonth() + 1);
  var year = today.getFullYear();

  return year + '-' + month + '-' + day;
}


/**
 *
 *
 *
 *
 */

function getFirstDateOfCurrentMonth() {
 var today = new Date();

 var month = padToTwoDigits(today.getMonth() + 1);
 var year = today.getFullYear();

 return year + '-' + month + '-' + '01';
}


/**
 *
 *
 *
 *
 */

function padToTwoDigits(number) {
     return (number < 10 ? '0' : '') + number;
}
