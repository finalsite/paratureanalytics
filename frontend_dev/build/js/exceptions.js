/**
 *
 * 
 * @param {string} message Error message
 * @constructor
 *
 */

function RootException(message) {
  this.message = message;
  this.name = 'Error';
}

RootException.prototype = Object.create(Error.prototype);
RootException.prototype.constructor = Error;
