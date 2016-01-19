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
  this.endpoint = 'http://localhost:5000/api/v1/action?';
  this.response = null;
  this.requestError = null;
}

/**
 *
 *
 *
 *
 */

ReportRequest.prototype.headerTemplates = {
  'standard': '<tr><th>Date</th><th>Ticket</th><th>Assigned To</th><th>Action</th></tr>',
  'aggregate': '<tr><th>Date</th><th>Total</th></tr>'
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

/**
 *
 *
 *
 *
 */

ReportRequest.prototype.render = function() {
  var uri = this.endpoint + this.parameters;
  $.ajax({
    url: uri,
    dataType: 'json',
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

ReportRequest.prototype.onSuccess = function(response) {
  this.response = response;
  var htmlTemplate = this.getResponseAsStrTemplate();

  var queryType = response['type'];
  var headers = this.headerTemplates[queryType];

  $dataPlaceholderContent = $('.placeholder__data .placeholder__content');
  $dataPlaceholderContent.removeClass('placeholder__content--empty');
  $dataPlaceholderContent.children('h3').remove();

  $('#total').empty().append('<p>Total: ' + response['total'] + '<p>');
  $('#headers').empty().append(headers);
  $('#results').empty().append(htmlTemplate);

  // Set Export button to report parameters
  $exportButton = $('.results__export.button');
  $exportButton.attr('href', 'http://localhost:5000/api/v1/download/myreport?' + this.parameters);
  $exportButton.removeClass('disabled');
}

/**
 *
 *
 *
 *
 */

ReportRequest.prototype.onError = function(response) {
  this.requestError = response;

  $dataPlaceholderContent = $('.placeholder__data .placeholder__content');
  $dataPlaceholderContent.children('h3').text('Something went wrong...');
}

/**
 *
 *
 *
 *
 */

ReportRequest.prototype.getResponseAsStrTemplate = function() {
  var rawData = this.response['results'];
  var htmlData = [];

  rawData.forEach(function(elem) {
    var htmlElem = '<tr>';
    if (elem.ticketNumber) {
      htmlElem += '<td>' + elem.timestamp.toLocaleString().slice(0, 10) + '</td>';
      htmlElem += '<td>' + elem.ticketNumber + '</td>';
      htmlElem += '<td>' + elem.assignedTo + '</td>';
      htmlElem += '<td>' + elem.actionType + '</td>';
    } else {
      htmlElem += '<td>' + elem._id + '</td>';
      htmlElem += '<td>' + elem.count + '</td>';
    }
    htmlElem += '</tr>';

    htmlData.push(htmlElem);
  });

  var htmlTemplate = htmlData.join('');
  return htmlTemplate;
}
