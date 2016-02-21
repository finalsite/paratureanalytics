/**
 *
 *
 * @param {string} message Error message
 * @constructor
 * @extends {Error}
 */

function RootException(message) {
  this.message = message;
  this.name = 'Error';
}

RootException.prototype = Object.create(Error.prototype);
RootException.prototype.constructor = Error;


/**
 *
 *
 * @param {string} message Error message
 * @constructor
 * @extends {Error}
 */

function NotImplementedException(message) {
  this.message = message;
  this.name = 'Error';
}

NotImplementedException.prototype = Object.create(Error.prototype);
NotImplementedException.prototype.constructor = Error;
