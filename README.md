# fastcgi-authz-client

Express module to query a FastCGI authorization server

## SYNOPSIS

```
var express = require('express');
var app = express();
var FcgiAuthz = require('fastcgi-authz-client');
var handler = FcgiAuthz({
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
```

## DESCRIPTION

fastcgi-authz-client is an [Express](https://github.com/expressjs/express#readme)
handler that verify upon an upstream FastCGI server if client is
authorizated to get this URL _([like Nginx `auth_request`](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html))_.

This can be used with [LemonLDAP::NG](https://lemonldap-ng.org) in a
[SSO-as-a-Service (SSOaaS)](https://lemonldap-ng.org/documentation/2.0/ssoaas)
system.

## PARAMETERS

fastcgi-authz-client gives any parameters (except PARAMS) to
`fastcgi-client`. See
its [documentation](https://github.com/LastLeaf/node-fastcgi-client) for more.

### PARAMS parameter

This parameter can be used to add a custom parameter in FastCGI request. For
example to give `RULES_URL` to Lemonldap::NG SSOaaS server:

```
var express = require('express');
var app = express();
var FcgiAuthz = require('fastcgi-authz-client');
var handler = FcgiAuthz({
  host: '127.0.0.1',
  port: 9090,
  PARAMS: {
    RULES_URL: 'http://my-server/rules.json'
  }
});

app.use(handler);
...
```

## RESPONSE HEADERS

fastcgi-authz-client stores FastCGI response header in `req.upstreamHeaders`
_(keys in lower case)_. You can so use them in Express application
_(see synopsis)_

## COPYRIGHT AND LICENSE

Copyright (C) 2018 by [Xavier Guimard](mailto:x.guimard@free.fr)

This library is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2, or (at your option)
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.

