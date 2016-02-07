var lastRunReportParameters = '';


if (window.location.pathname === '/') {
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');

  $.ajax({
    type: 'POST',
    url: 'http://localhost:5000/api/v1/token',
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
    },
    error: function(error) {
      alert('Session has expired!');
      window.location.replace('/login');
    },
  });
}


$('#report').on('submit', function(event) {
  event.preventDefault();

  var formDataAsQueryString = $(this).serialize();

  var request = new ReportRequest(formDataAsQueryString);
  request.render();

  lastRunReportParameters = request.parameters;
});


$('.tabs').on('click', '.tab__link', function() {
  $('.tab__panel--active').removeClass('tab__panel--active');

  $selectedTabPanel = $(this).parent('.tab__panel');
  $selectedTabPanel.addClass('tab__panel--active');
});


$('#sign__up').on('click', function(event) {
  event.preventDefault();
  alert('#alphaproblems -> Feature not yet available!');
})
