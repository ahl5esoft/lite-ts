var url = require('url');

module.exports = function(str, options) {
  options = options || {};

  var parsedUrl = url.parse(str);

  parsedUrl.pathname = replace(parsedUrl.pathname, options);
  parsedUrl.search = replace(parsedUrl.search, options);

  return url.format(parsedUrl);
};

function replace(str, options) {
  if (!str) {
    return str;
  }

  return str.replace(/:(\w+)/gi, function (match, p1) {
    var replacement = options[p1];
    if (!replacement) {
      throw new Error('Could not find url parameter ' + p1 + ' in passed options object');
    }

    return replacement;
  });
}