// Load form inputs
loadActionTypeList();
loadCsrList();
loadDateInputs();

// Bind event handlers
$('#report').on('submit', function(event) {
  event.preventDefault();

  var formDataAsQueryString = $(this).serialize();

  var request = new ReportRequest(formDataAsQueryString);
  request.render();
});

$('.tabs').on('click', '.tab__link', function() {
  $('.tab__panel--active').removeClass('tab__panel--active');

  $selectedTabPanel = $(this).parent('.tab__panel');
  $selectedTabPanel.addClass('tab__panel--active');
});
