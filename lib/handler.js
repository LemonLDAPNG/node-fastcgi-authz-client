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
      var k, q, query, ref, v;
      q = req.originalUrl.replace(new RegExp(`^${req.path}\\?*`), '');
      query = {
        HOST: req.hostname,
        QUERY_STRING: q,
        REQUEST_METHOD: req.method,
        CONTENT_LENGTH: '0',
        REQUEST_URI: req.originalUrl,
        PATH_INFO: req.path,
        SERVER_PROTOCOL: 'HTTP/1.1',
        GATEWAY_INTERFACE: 'CGI/1.1',
        REMOTE_ADDR: req.ip
      };
      ref = req.headers;
      for (k in ref) {
        v = ref[k];
        v = v.toUpperCase().replace(/-/g, '_');
        query[k] = `HTTP_${v}`;
      }
      return client.request(query, function(err, req) {
        if (err) {
          return res.status(500).send(err);
        }
        request.stdout.on('data', function(data) {
          return console.log(data);
        });
        return request.stdout.on('end', function() {
          // TODO read status, set headers, in req.upstream...
          return next();
        });
      });
    }

  };

  module.exports = FCGIClient;

}).call(this);
