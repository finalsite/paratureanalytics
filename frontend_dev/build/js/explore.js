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
  this.response = response;
  this.mount();
}

/**
 *
 *
 *
 *
 */

ExploreReport.prototype.mount = function() {
  var header = new ExploreReportHeader().render();
  var description = new ExploreReportDescription(this.parameters).render();
  if (this.response.type === 'standard') {
      var data = new ExploreReportStandardData(this.response['results']).render();
  } else if (this.response.type === 'aggregate') {
      var data = new ExploreReportAggregateData(this.response['results']).render();
  }


  var htmlTemplate = [
    header,
    description,
    data
  ];

  $('#results').empty().append(htmlTemplate.join(''));
};
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

function ExploreReportStandardData(data) {
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

ExploreReportStandardData.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

ExploreReportStandardData.prototype.load = function(data) {
  var htmlTemplate = [];

  var headerTemplate = '<table id="results" class="report report--explore"><tr><th class="column">Date</th><th class="column">Ticket Number</th><th class="column">Action Type</th><th>Team Member</th><th>Assigned From</th></tr>';
  htmlTemplate.push(headerTemplate);

  var totalActions = 0;

  data.forEach(function(elem) {
    totalActions += 1;

    var htmlElem = '<tr>';
    htmlElem += '<td>' + elem.timestamp.toLocaleString().slice(0, 10) + '</td>';
    htmlElem += '<td>' + elem.ticketNumber + '</td>';
    htmlElem += '<td>' + elem.actionType + '</td>';
    htmlElem += '<td>' + elem.assignedTo + '</td>';
    htmlElem += '<td>' + (elem.assignedFrom || '') + '</td>';
    htmlElem += '</tr>';

    htmlTemplate.push(htmlElem);
  });

  htmlTemplate.push('<tr><td class="column column--offset" colspan="4">Total: </td><td class="column">' + totalActions + '</td></tr></table>');
  return htmlTemplate.join('');
}


/**
 *
 *
 *
 *
 */

function ExploreReportAggregateData(data) {
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

ExploreReportAggregateData.prototype.render = function() {
  return this.template;
}


/**
 *
 *
 *
 *
 */

ExploreReportAggregateData.prototype.load = function(data) {
  var htmlTemplate = [];

  var headerTemplate = '<table id="results" class="report report--explore"><tr><th class="column">Grouping</th><th>Count</th></tr>';
  htmlTemplate.push(headerTemplate);

  var totalActions = 0;

  data.forEach(function(elem) {
    totalActions += elem.count;

    var htmlElem = '<tr>';
    htmlElem += '<td>' + elem._id + '</td>';
    htmlElem += '<td>' + elem.count + '</td>';
    htmlElem += '</tr>';

    htmlTemplate.push(htmlElem);
  });

  htmlTemplate.push('<tr><td class="column column--offset" colspan="1">Total: </td><td class="column">' + totalActions + '</td></tr></table>');
  return htmlTemplate.join('');
};
