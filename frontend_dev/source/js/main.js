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


function load(response) {
  console.log(response);
  var htmlTemplate = transformData(response);

  // Append to DOM
  $('#data').empty().append(htmlTemplate);
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

    if (data['actionType'] === '') {
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
  })
});
