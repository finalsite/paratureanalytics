var HEADERTEMPLATES = {
  'standard': '<tr><th>Date</th><th>Ticket</th><th>Assigned To</th><th>Action</th></tr>',
  'aggregate': '<tr><th>Date</th><th>Total</th></tr>'
}

function getQueryParameters(str) {
  // Source: https://css-tricks.com/snippets/jquery/get-query-params-object/
  return str.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0]
}

function fetchData() {
  $.ajax({
    url: 'api/v1/action',
    dataType: 'json',
    success: load
  });
}

function loadActionTypeList() {
  $.ajax({
    url: 'api/v1/action/type',
    dataType: 'json',
    success: function(response) {
      var results = response.results;

      var htmlTemplate = '<option value="all">All</option>';
      for (var i = 0; i < results.length; i++) {
        htmlTemplate += '<option value="' + results[i] + '">' + results[i] + '</option>';
      }

      $('#actionType').empty().append(htmlTemplate);
    }
  });
}

function load(response) {
  var htmlTemplate = transformData(response);

  var queryType = response['type'];
  var headers = HEADERTEMPLATES[queryType];

  $('.placeholder__data').hide()
  $('#total').empty().append('<h4>Total: ' + response['total'] + '<h4>');
  $('#headers').empty().append(headers);
  $('#results').empty().append(htmlTemplate);
}


function transformData(response) {
  var rawData = response['results'];
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


/* Event Listeners */

$(function() {
  loadActionTypeList();


  $('#report').on('submit', function(event) {
    event.preventDefault();

    var data = $(this).serialize();
    data = getQueryParameters(data);

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

    var uri = '/api/v1/action?' + $.param(data)
    $.ajax({
      url: uri,
      dataType: 'json',
      success: load
    });
  });

  // Tab Element
  $('.tabs').on('click', '.tab__link', function() {
    // Select all active class elements and remove them
    $('.tab__panel--active').removeClass('tab__panel--active');

    // Apply active class to this element
    $selectedTabPanel = $(this).parent('.tab__panel');
    $selectedTabPanel.addClass('tab__panel--active');
  });


});
