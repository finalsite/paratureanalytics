describe('ReportRequest', function() {

  beforeAll(function() {
    request = new ReportRequest('?actionType=all');
  });

  afterAll(function() {
    request = null;
  });

  it('raises exception when no argument provided', function() {
    expect(ReportRequest).toThrowError(Error);
  });

  it('_getQueryStrAsObj returns an object', function() {
    var result = request._getQueryStrAsObj('?actionType=1 Star Ticket Rating');

    expect(result).toEqual(jasmine.any(Object));
  });

  it('_parseParameters returns transformed query string', function() {
    var result = request._parseParameters('?actionType=all&assignedTo=Bobby');

    expect(result).toEqual('assignedTo=Bobby');
  });

});
