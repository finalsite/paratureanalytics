// Load form inputs
loadActionTypeList();
loadCsrList();
loadDateInputs();


var lastRunReportParameters = '';


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


$('.results__export.button').on('click', function(event) {
  event.preventDefault();
  if (lastRunReportParameters === '') {
    alert("Can't export a report that was never run!");
    return;
  }
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');
  var downloadUrl = 'http://localhost:5000/api/v1/download?' + lastRunReportParameters;

  $.ajax({
    type: 'GET',
    url: downloadUrl,
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: onExportSuccess,
    error: function(error) {
      console.log(error);
    }
  });
})


function onExportSuccess(response) {
  var downloadLink = response.file_token;
  var anchorTemplate = '<a id="tempLink" href="{link}" target="_blank"></a>'.replace('{link}', downloadLink);
  var $tempLink = $(anchorTemplate);
  $('body').append($tempLink);
  document.getElementById('tempLink').click();
  $('#tempLink').remove();
}
