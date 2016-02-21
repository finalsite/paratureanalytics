/**
 *
 * SummaryReport - Aggregate reportt
 * @param {string} parameters Query string of form input name/values
 * @constructor
 * @extends {Sprite}
 */

var SummaryReport = function(parameters) {
  if (!parameters) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.parameters = this._parseParameters(parameters) + '&groupBy=day,type';
  this.endpoint = API_HOSTNAME + 'api/v1/action?';
  this.response = null;
  this.requestError = null;
  this.headerTemplate = '<tr><th class="column">Date</th><th class="column">Action Type</th><th class="column">Total</th></tr>';
};

SummaryReport.prototype = Object.create(Report.prototype);
SummaryReport.prototype.constructor = SummaryReport;


/**
 *
 *
 *
 *
 */

SummaryReport.prototype.onSuccess = function(response) {
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

SummaryReport.prototype.onError = function(response) {
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

SummaryReport.prototype.getResponseAsStrTemplate = function() {
  var rawData = this.response['results'];

  var htmlData = [];
  htmlData.push(this.headerTemplate);

  var totalActions = 0;
  rawData.forEach(function(elem) {
    totalActions += elem.count;
    var htmlElem = '<tr>';

    htmlElem += '<td class="column">' + elem.date + '</td>';
    htmlElem += '<td class="column">' + elem.type || elem.assignedTo + '</td>';
    htmlElem += '<td class="column">' + elem.count + '</td>';
    htmlElem += '</tr>';

    htmlData.push(htmlElem);
  });
  htmlData.push('<tr><td class="column column--offset" colspan="2">Total: </td><td class="column">' + totalActions + '</td>')
  var htmlTemplate = htmlData.join('');
  return htmlTemplate;
};
