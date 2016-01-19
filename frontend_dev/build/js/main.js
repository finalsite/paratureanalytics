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


loadActionTypeList();


var requests = [];

$('#report').on('submit', function(event) {
  event.preventDefault();

  var formDataAsQueryString = $(this).serialize();

  var request = new ReportRequest(formDataAsQueryString);
  request.render();

  requests.push(request);
});


$('.tabs').on('click', '.tab__link', function() {
  // Select all active class elements and remove them
  $('.tab__panel--active').removeClass('tab__panel--active');

  // Apply active class to this element
  $selectedTabPanel = $(this).parent('.tab__panel');
  $selectedTabPanel.addClass('tab__panel--active');
});
