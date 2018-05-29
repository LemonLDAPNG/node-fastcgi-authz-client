###
# Express module to query a FastCGI authorization server
#
# See README.md for license and copyright
###

class FCGIClient
	constructor: (args) ->
		for a in ['host','port']
			throw "Missing #{a} parameter" unless args[a]
		# Build FastCGI client
		connector = require 'fastcgi-client'
		@client = connector	args

	run: (req, res, next) ->
		query =
			HOST: req.headers.host
			QUERY_STRING: '',
			REQUEST_METHOD: 'GET'
			CONTENT_TYPE: ''
			CONTENT_LENGTH: ''
			REQUEST_URI: '/helloworld.php'
			SERVER_PROTOCOL: 'HTTP/1.1'
			GATEWAY_INTERFACE: 'CGI/1.1'
			REMOTE_ADDR: '127.0.0.1'
			REMOTE_PORT: 12345
			SERVER_ADDR: '127.0.0.1'
			SERVER_PORT: 80
			SERVER_NAME: '127.0.0.1'
		for k,v of req.headers
			v = v.toUpperCase().replace /-/g, '_'
			query[k] = "HTTP_#{v}"

module.exports = FCGIClient
