/**
 *
 *
 *
 *
 */

$('#login__form').on('submit', function(event) {
  event.preventDefault();
  // Disable login button
  $('#login__submit').attr('disabled', true);

  var formData = _getQueryStrAsObj($(this).serialize());
  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(formData['username'] + ':' + formData['password']);

  $.ajax({
    type: 'POST',
    url: API_HOSTNAME + 'api/v1/token',
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: onLoginSuccess,
    error: function(error) {
      alert('Invalid username or password!')
    },
    complete: function(xhr, status) {
      // Re-enable login button
      $('#login__submit').attr('disabled', false);
    }
  });
});


/**
 *
 *
 *
 *
 */

 function onLoginSuccess(response) {
    sessionStorage.accessToken = response.token;
    window.location.replace('/');
 }
