(function() {
  /*
   * Express module to query a FastCGI authorization server
   *
   * See README.md for license and copyright
   */
  module.exports = function(args) {
    var a, client, connector, handler, i, len, params, ref, run;
    if (!args.sockFile) {
      ref = ['host', 'port'];
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        if (!args[a]) {
          throw `Missing ${a} parameter (or sockFile)`;
        }
      }
    }
    // Build FastCGI client
    connector = require('fastcgi-client');
    params = {};
    if (args.PARAMS) {
      params = args.PARAMS;
      delete args.PARAMS;
    }
    client = connector(args);
    run = function(req, res, next) {
      return res.status(500).send('Not yet ready');
    };
    client.on('ready', function() {
      run = function(req, res, next) {
        var k, q, query, ref1, v;
        q = req.originalUrl.replace(new RegExp(`^${req.path}\\?*`), '');
        query = {
          HOST: req.headers.host,
          QUERY_STRING: q,
          REQUEST_METHOD: req.method,
          CONTENT_LENGTH: '0',
          REQUEST_URI: req.originalUrl,
          PATH_INFO: req.path,
          SERVER_PROTOCOL: 'HTTP/1.1',
          GATEWAY_INTERFACE: 'CGI/1.1',
          REMOTE_ADDR: req.ip
        };
        ref1 = req.headers;
        for (k in ref1) {
          v = ref1[k];
          k = k.toUpperCase().replace(/-/g, '_');
          query[`HTTP_${k}`] = v;
        }
        for (k in params) {
          v = params[k];
          k = k.toUpperCase();
          query[k] = v;
        }
        return client.request(query, function(err, freq) {
          var resp;
          if (err) {
            return res.status(500).send(err);
          }
          resp = '';
          freq.stdout.on('data', function(data) {
            return resp += data.toString();
          });
          return freq.stdout.on('end', function() {
            var code, headers, j, l, len1, lines;
            // TODO read status, set headers, in req.upstream...
            lines = resp.split(/\r?\n/);
            headers = {};
            for (j = 0, len1 = lines.length; j < len1; j++) {
              l = lines[j];
              if (l.match(/^(.*?): (.*)$/)) {
                v = RegExp.$2;
                k = RegExp.$1.toLowerCase();
                headers[k] = v;
              }
            }
            code = parseInt(headers.status.replace(/\s.*$/, ''));
            if (headers.location && (code === 401 || code === 302)) {
              return res.redirect(headers.location);
            } else if (code < 300) {
              req.upstreamHeaders = headers;
              return next();
            } else {
              return res.status(code).send(headers.status);
            }
          });
        });
      };
      return console.log('Ready');
    });
    handler = function(req, res, next) {
      return run(req, res, next);
    };
    return handler;
  };

}).call(this);
