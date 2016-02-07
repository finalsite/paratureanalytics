/**
 *
 *
 *
 */

$('.results__export.button').on('click', function(event) {
  event.preventDefault();
  if (lastRunReportParameters === '') {
    alert("Can't export a report that was never run!");
    return;
  }
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(sessionStorage.accessToken + ':');
  var downloadUrl = API_HOSTNAME + 'api/v1/action/download?' + lastRunReportParameters;

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
      if (response.status === 403) {
        alert('Login session expired!');
        window.location.replace('/login');
      }
    }
  });
})

/**
 *
 *
 *
 */

function onExportSuccess(response) {
  var downloadLink = response.file_token;
  var anchorTemplate = '<a id="tempLink" href="{link}" target="_blank"></a>'.replace('{link}', downloadLink);
  var $tempLink = $(anchorTemplate);
  $('body').append($tempLink);
  document.getElementById('tempLink').click();
  $('#tempLink').remove();
}
