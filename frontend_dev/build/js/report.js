/**
 *
 *
 * @param {string} parameters Query string of form input name/values
 * @constructor
 *
 */

function ReportRequest(parameters) {
  if (!parameters) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.parameters = this._parseParameters(parameters);

}

/**
 *
 * Transform form input into API ready query string
 * @param {string} parameters Query string of form input name/values
 * @return {string}
 *
 */

ReportRequest.prototype._parseParameters = function(parameters) {
  data = this._getQueryStrAsObj(parameters);

  if (data['groupBy'] === 'none') {
    delete data['groupBy'];
  }
  if (data['dateMin'] === '') {
    delete data['dateMin'];
  }
  if (data['dateMax'] === '') {
    delete data['dateMax'];
  }
  if (data['actionType'] === 'all') {
    delete data['actionType'];
  }
  if (data['ticketNumber'] === '') {
    delete data['ticketNumber'];
  }
  if (data['assignedTo'] === 'all') {
    delete data['assignedTo'];
  }
  if (data['assignedFrom'] === 'all') {
    delete data['assignedFrom'];
  }

  return $.param(data);
}

/**
 *
 *
 * @param {string} str Query string of form input name/values
 * @return {object}
 *
 */

ReportRequest.prototype._getQueryStrAsObj = function(str) {
  // Source: https://css-tricks.com/snippets/jquery/get-query-params-object/
  return str.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0]
}
