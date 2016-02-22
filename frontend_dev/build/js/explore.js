/**
 *
 * ExploreReport - Aggregate reportt
 * @param {string} parameters Query string of form input name/values
 * @constructor
 * @extends {Report}
 */

var ExploreReport = function(parameters) {
  if (!parameters) {
    throw new RootException('Missing argument. 1 expected, 0 given!');
  }
  this.parameters = this._getQueryStrAsObj(parameters);
  this.queryString = this._parseParameters(this.parameters);
  this.endpoint = API_HOSTNAME + 'api/v1/action?';

  this.response = null;
  this.requestError = null;
};

ExploreReport.prototype = Object.create(Report.prototype);
ExploreReport.prototype.constructor = ExploreReport;


/**
 *
 *
 *
 *
 */

ExploreReport.prototype.render = function() {
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
    context: this
  });
}


/**
 *
 *
 *
 *
 */

ExploreReport.prototype.onSuccess = function(response) {
  var header = new ExploreReportHeader().render();
  var description = new ExploreReportDescription(this.parameters).render();
  var data = new ExploreReportData(response['results']).render();

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

ExploreReport.prototype.onError = function(response) {
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

function ExploreReportHeader() {
  this.template = '<h3>Explore Report</h3>';
}


/**
 *
 *
 *
 *
 */

ExploreReportHeader.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

function ExploreReportDescription(reportFields) {
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

ExploreReportDescription.prototype.render = function() {
  return this.template;
}

/**
 *
 *
 *
 *
 */

ExploreReportDescription.prototype.load = function(reportFields) {
  var htmlTemplate = '<p>Date Range: ' + reportFields['dateMin'] + ' to ' + reportFields['dateMax'] + '</p>';

  return htmlTemplate;
}

/**
 *
 *
 *
 *
 */

function ExploreReportData(data) {
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

ExploreReportData.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

ExploreReportData.prototype.load = function(data) {
  var htmlTemplate = [];
  console.log(data);
  var headerTemplate = '<table id="results" class="report report--explore"><tr><th class="column">Date</th><th class="column">Ticket Number</th><th class="column">Action Type</th><th>Team Member</th><th>Assigned From</th></tr>';
  htmlTemplate.push(headerTemplate);

  data.forEach(function(elem) {
    var htmlElem = '<tr>';
    if (elem.ticketNumber) {
      htmlElem += '<td>' + elem.timestamp.toLocaleString().slice(0, 10) + '</td>';
      htmlElem += '<td>' + elem.ticketNumber + '</td>';
      htmlElem += '<td>' + elem.actionType + '</td>';
      htmlElem += '<td>' + elem.assignedTo + '</td>';
      htmlElem += '<td>' + (elem.assignedFrom || '') + '</td>';
    } else {
      htmlElem += '<td>' + elem._id + '</td>';
      htmlElem += '<td>' + elem.count + '</td>';
    }
    htmlElem += '</tr>';

    htmlTemplate.push(htmlElem);
  });

  htmlTemplate.push('<tr><td class="column column--offset" colspan="4">Total: </td><td class="column">' + 'Next release?' + '</td></tr></table>');
  return htmlTemplate.join('');
}


/**
 *
 *
 *
 *
 */

ExploreReport.prototype.headerTemplates = {
  'standard': '<tr><th>Date</th><th>Ticket</th><th>Action</th><th>Assigned To</th><th>Assigned From</th></tr>',
  'aggregate': '<tr><th>Date</th><th>Total</th></tr>'
}
