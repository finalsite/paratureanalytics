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
      console.log(error);
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
  $.ajax({
    url: 'http://localhost:5000/api/v1/action/csr',
    dataType: 'json',
    success: function(response) {
      var results = response.results;

      var htmlTemplate = '<option value="all">All</option>';
      for (var i = 0; i < results.length; i++) {
        htmlTemplate += '<option value="' + results[i] + '">' + results[i] + '</option>';
      }

      $('#assignedTo').empty().append(htmlTemplate);
      $('#assignedFrom').empty().append(htmlTemplate);
    }
  });
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
