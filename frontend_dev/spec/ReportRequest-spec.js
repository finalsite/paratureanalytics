describe('ReportRequest', function() {

  it('raises exception when no argument provided', function() {
    expect(ReportRequest).toThrowError(Error);
  });

  it('_getQueryStrAsObj returns an object', function() {
    var request = new ReportRequest('actionType=all');

    var result = request._getQueryStrAsObj('?actionType=1 Star Ticket Rating');

    expect(result).toEqual(jasmine.any(Object));
  });

  it('_parseParameters returns transformed query string', function() {
    var request = new ReportRequest('?actionType=all');

    var result = request._parseParameters('?actionType=all&assignedTo=Bobby');

    expect(result).toEqual('assignedTo=Bobby');
  });

});
