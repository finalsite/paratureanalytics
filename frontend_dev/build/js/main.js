var lastRunReportParameters = '';


if (window.location.pathname === '/') {
  loadActionTypeList();
  loadCsrList();
  loadDateInputs();
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
  alert('Feature not yet available!');
})
