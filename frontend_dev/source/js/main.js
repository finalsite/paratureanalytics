var lastRunReportParameters = '';
var LAST_RUN_REPORT = null;

loadDateInputs();


/**
 *
 *
 *
 *
 */

if (window.location.pathname.slice(0, 6) !== '/login') {
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');

  $.ajax({
    type: 'POST',
    url: API_HOSTNAME + 'api/v1/token',
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: function(response) {
      sessionStorage.accessToken = response.token;
      loadActionTypeList();
      loadCsrList();
      loadDateInputs();
      $('#cover').hide();
    },
    error: function(error) {
      window.location.replace('/login');
    },
  });
}


/**
 *
 *
 *
 *
 */

$('#summary-report').on('submit', function(event) {
  event.preventDefault();
  $('#summary-report .button[type="submit"]').attr('disabled', true);

  var formDataAsQueryString = $(this).serialize();

  var report = new SummaryReport(formDataAsQueryString);
  report.render();

  lastRunReportParameters = report.queryString;
  LAST_RUN_REPORT = report;
});


/**
 *
 *
 *
 *
 */

$('#results').on('dblclick', 'tr', function(event) {
  event.preventDefault();

  var uri = $(this).attr('data-drill-down-uri');
  var elementHasDrillDownUri = uri ? true : false;

  if (elementHasDrillDownUri) {
    var report = new DetailReport(uri);
    report.render();
    lastRunReportParameters = report.queryString;
  }
});


/**
 *
 *
 *
 *
 */

$('#explore-report').on('submit', function(event) {
  event.preventDefault();
  $('#explore-report .button[type="submit"]').attr('disabled', true);

  var formDataAsQueryString = $(this).serialize();

  var report = new ExploreReport(formDataAsQueryString);
  report.render();

  lastRunReportParameters = report.queryString;
});


/**
 *
 *
 *
 *
 */

$('#results').on('click', '.button--back', function(event) {
  event.preventDefault();

  $('#results').empty();
  LAST_RUN_REPORT.mount();
});


/**
 *
 *
 *
 *
 */

$('.tabs').on('click', '.tab__link', function() {
  $('.tab__panel--active').removeClass('tab__panel--active');

  $selectedTabPanel = $(this).parent('.tab__panel');
  $selectedTabPanel.addClass('tab__panel--active');
});


/**
 *
 *
 *
 *
 */

$('#sign__up').on('click', function(event) {
  event.preventDefault();
  alert('#betaproblems -> Feature not yet available!');
})
