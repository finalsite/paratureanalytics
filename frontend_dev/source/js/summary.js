/**
 *
 * SummaryReport - Aggregate reportt
 * @param {string} parameters Query string of form input name/values
 * @constructor
 * @extends {Report}
 */

var SummaryReport = function(parameters) {
  if (!parameters) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.parameters = this._getQueryStrAsObj(parameters);
  this.queryString = this._parseParameters(this.parameters) + '&groupBy=day,type';
  this.endpoint = API_HOSTNAME + 'api/v1/action?';

  this.response = null;
  this.requestError = null;
};

SummaryReport.prototype = Object.create(Report.prototype);
SummaryReport.prototype.constructor = SummaryReport;


/**
 *
 *
 *
 *
 */

SummaryReport.prototype.render = function() {
  var uri = this.endpoint + this.queryString;
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
    context: this,
    complete: function(xhr, status) {
      // Re-enable login button
      $('#summary-report .button[type="submit"]').attr('disabled', false);
    }
  });
}


/**
 *
 *
 *
 *
 */

SummaryReport.prototype.onSuccess = function(response) {
  this.response = response;
  this.mount();
}


/**
 *
 *
 *
 *
 */

SummaryReport.prototype.mount = function() {
  var header = new SummaryReportHeader().render();
  var description = new SummaryReportDescription(this.parameters).render();
  var data = new SummaryReportData(this.response['results']).render();

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

function SummaryReportHeader() {
  this.template = '<h3>Summary Report</h3>';
}


/**
 *
 *
 *
 *
 */

SummaryReportHeader.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

function SummaryReportDescription(reportFields) {
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

SummaryReportDescription.prototype.render = function() {
  return this.template;
}

/**
 *
 *
 *
 *
 */

SummaryReportDescription.prototype.load = function(reportFields) {
  var htmlTemplate = '<p>Date Range: ' + reportFields['dateMin'] + ' to ' + reportFields['dateMax'] + '</p>';

  return htmlTemplate;
}

/**
 *
 *
 *
 *
 */

function SummaryReportData(data) {
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

SummaryReportData.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

SummaryReportData.prototype.load = function(data) {
  var headerTemplate = '<table id="results" class="report report--summary"><tr><th class="column">Date</th><th class="column">Action Type</th><th class="column">Total</th></tr>';
  var htmlTemplate = [];
  htmlTemplate.push(headerTemplate);

  var totalActions = 0;

  data.forEach(function(elem) {
    totalActions += elem.count;

    var htmlElem = '';
    htmlElem += '<tr data-drill-down-uri="' + elem.drillDownUri + '">';
    htmlElem += '<td class="column">' + elem.date + '</td>';
    htmlElem += '<td class="column">' + elem.type + '</td>';
    htmlElem += '<td class="column">' + elem.count + '</td>';
    htmlElem += '</tr>';

    htmlTemplate.push(htmlElem);
  });

  htmlTemplate.push('<tr><td class="column column--offset" colspan="2">Total: </td><td class="column">' + totalActions + '</td></tr></table>');
  return htmlTemplate.join('');
}
