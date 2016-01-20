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
