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
    success: function(response) {
      console.log(response);
    },
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

function _getQueryStrAsObj(str) {
  // Source: https://css-tricks.com/snippets/jquery/get-query-params-object/
  return str.replace(/(^\?)/, '').split("&").map(function(n) {
    return n = n.split("="), this[n[0]] = n[1], this
  }.bind({}))[0]
}


/**
 *
 *
 *
 *
 */

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}
