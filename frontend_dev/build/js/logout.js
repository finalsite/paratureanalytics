/**
 *
 *
 *
 *
 */

$('#sign__out').on('click', function(event) {
  event.preventDefault();
  // Disable login button
  sessionStorage.accessToken = '';
  window.location.replace('/login');
});
