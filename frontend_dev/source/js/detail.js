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
  endpointParameters = endpoint.split('?')[1];
  this.parameters = this._getQueryStrAsObj(endpointParameters);
  this.queryString = this._parseParameters(this.parameters)
  this.endpoint = API_HOSTNAME + endpoint;

  this.response = null;
  this.requestError = null;
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
  var header = new DetailReportHeader().render();
  var description = new DetailReportDescription(this.parameters).render();
  var data = new DetailReportData(response['results']).render();

  var htmlTemplate = [
    header,
    description,
    data
  ];

  $('#results').empty().append(htmlTemplate.join(''));
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

function DetailReportHeader() {
  this.template = '<h3 class="report__title">Detail Report</h3><div class="button button--back">Go back</div>';
}


/**
 *
 *
 *
 *
 */

DetailReportHeader.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

function DetailReportDescription(reportFields) {
  if (!reportFields) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.template = this.load(reportFields);
}


/**
 *
 *
 *
 *
 */

DetailReportDescription.prototype.render = function() {
  return this.template;
}

/**
 *
 *
 *
 *
 */

DetailReportDescription.prototype.load = function(reportFields) {
  var htmlTemplate = '<p>Date Range: ' + reportFields['dateMin'] + ' to ' + reportFields['dateMax'] + '</p>';

  return htmlTemplate;
}


/**
 *
 *
 *
 *
 */

function DetailReportData(data) {
  if (!data) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.template = this.load(data);
}


/**
 *
 *
 *
 *
 */

DetailReportData.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

DetailReportData.prototype.load = function(data) {
  var headerTemplate = '<table id="results" class="report report--detail"><tr><th class="column">Team Member</th><th class="column">Action Type</th><th class="column">Total</th></tr>';
  var htmlTemplate = [];
  htmlTemplate.push(headerTemplate);

  var totalActions = 0;

  data.forEach(function(elem) {
    totalActions += elem.count;

    var htmlElem = '';
    htmlElem += '<tr>';
    htmlElem += '<td class="column">' + elem.assignedTo + '</td>';
    htmlElem += '<td class="column">' + elem.type + '</td>';
    htmlElem += '<td class="column">' + elem.count + '</td>';
    htmlElem += '</tr>';

    htmlTemplate.push(htmlElem);
  });

  htmlTemplate.push('<tr><td class="column column--offset" colspan="2">Total: </td><td class="column">' + totalActions + '</td></tr></table>');
  return htmlTemplate.join('');
}
