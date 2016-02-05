/**
 *
 *
 *
 *
 */

$('#login__form').on('submit', function(event) {
  event.preventDefault();
  var formData = _getQueryStrAsObj($(this).serialize());

  var authorizationHeaderValue = 'Basic ' + b64EncodeUnicode(formData['username'] + ':' + formData['password']);

  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/api/v1/token',
    dataType: 'json',
    headers: {
      'Authorization': authorizationHeaderValue
    },
    crossDomain: true,
    success: onLoginSuccess,
    error: function(error) {
      console.log(error);
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
 }
