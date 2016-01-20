/**
 *
 *
 *
 *
 */

function loadActionTypeList() {
  $.ajax({
    url: 'http://localhost:5000/api/v1/action/type',
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
  var firstDayOfMonth = getFirstDayOfCurrentMonth();

  $('#dateMin').attr('value', firstDayOfMonth);
  $('#dateMax').attr('value', today);
}

 /**
  *
  *
  *
  *
  */

function getTodayFormatted() {
  var today = new Date();

  var day = padToTwoDigits(today.getDate() + 1);
  var month = padToTwoDigits(today.getMonth() + 1);
  var year = today.getFullYear();

  return year + '-' + month + '-' + day;
}

/**
 *
 *
 *
 *
 */

function getFirstDayOfCurrentMonth() {
 var today = new Date();

 var month = padToTwoDigits(today.getMonth() + 1);
 var year = today.getFullYear();
 console.log(year + '-' + month + '-' + '01');
 return year + '-' + month + '-' + '01';
}

/**
 *
 *
 *
 *
 */

function padToTwoDigits(number) {
     return (number < 10 ? '0' : '') + number;
}
