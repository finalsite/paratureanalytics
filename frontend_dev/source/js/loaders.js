/**
 *
 *
 *
 *
 */

function loadActionTypeList() {
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/api/v1/action/type',
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: onActionTypeListSuccess,
    error: function(error) {
      $('#actionType').empty().append('<option value="boo">Error: Session expired</option>');
    }
  });
}


/**
 *
 *
 *
 *
 */

function onActionTypeListSuccess(response) {
  var results = response.results;

  var htmlTemplate = '<option value="all">All</option>';
  for (var i = 0; i < results.length; i++) {
    htmlTemplate += '<option value="' + results[i] + '">' + results[i] + '</option>';
  }

  $('#actionType').empty().append(htmlTemplate);
}


/**
 *
 *
 *
 *
 */

function loadCsrList() {
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');

  $.ajax({
    url: 'http://localhost:5000/api/v1/action/csr',
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: onCsrListSuccess,
    error: function(error) {
      $('#assignedTo, #assignedFrom').empty().append('<option value="boo">Error: Session expired</option>');
    }
  });
}


/**
 *
 *
 *
 *
 */

function onCsrListSuccess(response) {
  var results = response.results;

  var htmlTemplate = '<option value="all">All</option>';
  for (var i = 0; i < results.length; i++) {
    htmlTemplate += '<option value="' + results[i] + '">' + results[i] + '</option>';
  }

  $('#assignedTo, #assignedFrom').empty().append(htmlTemplate);
}


/**
 *
 *
 *
 *
 */

function loadDateInputs() {
  var today = getTodayFormatted();
  var firstDayOfMonth = getFirstDateOfCurrentMonth();

  $('#dateMin').attr('value', firstDayOfMonth);
  $('#dateMax').attr('value', today);
}
