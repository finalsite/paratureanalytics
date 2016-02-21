/**
 *
 * Report - Abstract base class for Report component
 * @param {string} parameters Query string of form input name/values
 * @constructor
 *
 */

function Report(parameters) {
  if (!parameters) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.parameters = this._getQueryStrAsObj(paremeters);
  this.queryString = this._parseParameters(this.parameters);
  this.endpoint = API_HOSTNAME + 'api/v1/action?';
  this.response = null;
  this.requestError = null;
}


/**
 *
 * Transform form input into API ready query string
 * @param {string} parameters Query string of form input name/values
 * @return {string}
 *
 */

Report.prototype._parseParameters = function(parameters) {
  if (parameters['groupBy'] === 'none') {
    delete parameters['groupBy'];
  }
  if (parameters['dateMin'] === '') {
    delete parameters['dateMin'];
  }
  if (parameters['dateMax'] === '') {
    delete parameters['dateMax'];
  }
  if (parameters['actionType'] === 'all') {
    delete parameters['actionType'];
  }
  if (parameters['ticketNumber'] === '') {
    delete parameters['ticketNumber'];
  }
  if (parameters['assignedTo'] === 'all') {
    delete parameters['assignedTo'];
  }
  if (parameters['assignedFrom'] === 'all') {
    delete parameters['assignedFrom'];
  }

  return $.param(parameters);
}

/**
 *
 *
 * @param {string} str Query string of form input name/values
 * @return {object}
 *
 */

Report.prototype._getQueryStrAsObj = function(str) {
  // Source: https://css-tricks.com/snippets/jquery/get-query-params-object/
  return str.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0]
}

/**
 *
 *
 *
 *
 */

Report.prototype.render = function() {
  throw new NotImplementedException("Render method not implemented. All sub classes require a render method.")
}

/**
 *
 *
 *
 *
 */

Report.prototype.onSuccess = function(response) {
  throw new NotImplementedException("onSuccess method not implemented. All sub classes require a onSuccess method.")
}

/**
 *
 *
 *
 *
 */

Report.prototype.onError = function(response) {
  throw new NotImplementedException("onError method not implemented. All sub classes require a onError method.");
}
