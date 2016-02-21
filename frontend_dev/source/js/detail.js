/**
 *
 * DetailReport - Aggregate reportt
 * @param {string} parameters Query string of form input name/values
 * @constructor
 * @extends {Report}
 */

var DetailReport = function(endpoint) {
  if (!endpoint) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.endpoint = API_HOSTNAME + endpoint;
  this.response = null;
  this.requestError = null;
  this.headerTemplate = '<tr><th class="column">Team Member</th><th class="column">Action Type</th><th class="column">Total</th></tr>';
};

DetailReport.prototype = Object.create(Report.prototype);
DetailReport.prototype.constructor = DetailReport;


/**
 *
 *
 *
 *
 */

DetailReport.prototype.render = function() {
  var uri = this.endpoint;
  console.log(uri);
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');
  $.ajax({
    url: uri,
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: this.onSuccess,
    error: this.onError,
    context: this
  });
}


/**
 *
 *
 *
 *
 */

DetailReport.prototype.onSuccess = function(response) {
  console.log(response);
  this.response = response;
  var htmlTemplate = this.getResponseAsStrTemplate();
  $('#results').empty().append(htmlTemplate);
}


/**
 *
 *
 *
 *
 */

DetailReport.prototype.onError = function(response) {
  if (response.status === 403) {
    alert('Login session expired!');
    window.location.replace('/login');
  }
  this.requestError = response;
  alert('Something went wrong...');
}


/**
 *
 *
 *
 *
 */

DetailReport.prototype.getResponseAsStrTemplate = function() {
  var rawData = this.response['results'];

  var htmlData = [];
  htmlData.push(this.headerTemplate);

  var totalActions = 0;
  rawData.forEach(function(elem) {
    totalActions += elem.count;
    var htmlElem = '<tr>';

    htmlElem += '<td class="column">' + elem.assignedTo + '</td>';
    htmlElem += '<td class="column">' + elem.type ||  + '</td>';
    htmlElem += '<td class="column">' + elem.count + '</td>';
    htmlElem += '</tr>';

    htmlData.push(htmlElem);
  });
  htmlData.push('<tr><td class="column column--offset" colspan="2">Total: </td><td class="column">' + totalActions + '</td>')
  var htmlTemplate = htmlData.join('');
  return htmlTemplate;
};
