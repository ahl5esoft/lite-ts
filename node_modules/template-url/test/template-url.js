var expect = require('chai').expect;
var templateUrl = require('../');

describe('templateUrl', function() {
  it('should replace rest url variables', function() {
    var url = templateUrl('/:name', { name: 'hugo' });

    expect(url).to.exist;
    expect(url).to.equal('/hugo');
  });

  it('should replace multiple occurrences of url variables', function() {
    var url = templateUrl('/:name/:name', { name: 'hugo' });

    expect(url).to.exist;
    expect(url).to.equal('/hugo/hugo');
  });

  it('should not replace protocol part of urls', function() {
    var url = templateUrl('http://localhost/:name/:name', { name: 'hugo' });

    expect(url).to.exist;
    expect(url).to.equal('http://localhost/hugo/hugo');
  });

  it('should replace different occurrences of url variables', function() {
    var url = templateUrl('http://localhost/:id/:name', { id: '1', name: 'hugo' });

    expect(url).to.exist;
    expect(url).to.equal('http://localhost/1/hugo');
  });

  it('should replace base URLs', function() {
    var url = templateUrl(':apiBaseUrl/repos/:owner/:repo/branches',  { owner: 'hugo', repo: 'hugosrepo', apiBaseUrl: 'http://localhost' });

    expect(url).to.exist;
    expect(url).to.equal('http://localhost/repos/hugo/hugosrepo/branches');
  });

  it('should throw an exception if a URL variable could not be satisfied', function(done) {
    try {
      templateUrl(':apiBaseUrl/repos/:owner/:repo/branches',  { owner: 'hugo', repo: 'hugosrepo' });

      done(new Error('Expected error to be thrown'));
    } catch (e) {
      done();
    }
  });

  it('should leave ports in host untouched', function() {
    var url = templateUrl('http://localhost:3000/:id/:name', { id: '1', name: 'hugo' });

    expect(url).to.exist;
    expect(url).to.equal('http://localhost:3000/1/hugo');
  });

  it('should replace template parameters in query string', function() {
    var url = templateUrl('http://localhost:3000/:id/:name?q=:term', { id: '1', name: 'hugo', term : 'termValue' });

    expect(url).to.exist;
    expect(url).to.equal('http://localhost:3000/1/hugo?q=termValue');
  });
});