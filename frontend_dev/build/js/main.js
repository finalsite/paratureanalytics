function fetchData() {
  $.ajax({
    url: 'api/v1/action',
    dataType: 'json',
    success: load
  });
}


function load(response) {
  var htmlTemplate = transformData(response);

  // Append to DOM
  $('#data').empty().append(htmlTemplate);
}


function transformData(response) {
  var rawData = response['results'];
  var htmlData = [];

  rawData.forEach(function(elem) {
    var htmlElem = '<tr>';
    htmlElem += '<td>' + elem.timestamp.slice(0, 10) + '</td>';
    htmlElem += '<td>' + elem.ticketNumber + '</td>';
    htmlElem += '<td>' + elem.assignedTo + '</td>';
    htmlElem += '<td>' + elem.actionType + '</td>';
    htmlElem += '</tr>';

    htmlData.push(htmlElem);
  });

  var htmlTemplate = htmlData.join('');
  return htmlTemplate;
}


window.onload = fetchData;
