var express = require('express');
var app = express();
var handler = require('./');
handler = handler({
  host: '127.0.0.1',
  port: 9090
});

app.use(handler);

app.get('/', function(req, res) {
  return res.send('Hello ' + req.upstreamHeaders['auth-user'] + ' !');
});
app.listen(3000, function() {
  return console.log('Example app listening on port 3000!');
});
