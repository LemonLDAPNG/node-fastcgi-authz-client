(function() {
  /*
   * Express module to query a FastCGI authorization server
   *
   * See README.md for license and copyright
   */
  var FCGIClient;

  FCGIClient = class FCGIClient {
    constructor(args) {
      var a, connector, i, len, ref;
      ref = ['host', 'port'];
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        if (!args[a]) {
          throw `Missing ${a} parameter`;
        }
      }
      // Build FastCGI client
      connector = require('fastcgi-client');
      this.client = connector(args);
    }

    run(req, res, next) {
      var k, query, ref, results, v;
      query = {
        HOST: req.headers.host,
        QUERY_STRING: '',
        REQUEST_METHOD: 'GET',
        CONTENT_TYPE: '',
        CONTENT_LENGTH: '',
        REQUEST_URI: '/helloworld.php',
        SERVER_PROTOCOL: 'HTTP/1.1',
        GATEWAY_INTERFACE: 'CGI/1.1',
        REMOTE_ADDR: '127.0.0.1',
        REMOTE_PORT: 12345,
        SERVER_ADDR: '127.0.0.1',
        SERVER_PORT: 80,
        SERVER_NAME: '127.0.0.1'
      };
      ref = req.headers;
      results = [];
      for (k in ref) {
        v = ref[k];
        v = v.toUpperCase().replace(/-/g, '_');
        results.push(query[k] = `HTTP_${v}`);
      }
      return results;
    }

  };

  module.exports = FCGIClient;

}).call(this);
