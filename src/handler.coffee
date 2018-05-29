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
		q = req.originalUrl.replace(new RegExp("^#{req.path}\\?*"), '')
		query =
			HOST: req.hostname
			QUERY_STRING: q
			REQUEST_METHOD: req.method
			CONTENT_LENGTH: '0'
			REQUEST_URI: req.originalUrl
			PATH_INFO: req.path
			SERVER_PROTOCOL: 'HTTP/1.1'
			GATEWAY_INTERFACE: 'CGI/1.1'
			REMOTE_ADDR: req.ip
		for k,v of req.headers
			v = v.toUpperCase().replace /-/g, '_'
			query[k] = "HTTP_#{v}"
		client.request query, (err, req) ->
			return res.status(500).send err if err
			request.stdout.on 'data', (data) ->
				console.log data
			request.stdout.on 'end', ->
				# TODO read status, set headers, in req.upstream...
				return next()

module.exports = FCGIClient
