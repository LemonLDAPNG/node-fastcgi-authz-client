###
# Express module to query a FastCGI authorization server
#
# See README.md for license and copyright
###

module.exports = (args) ->
	unless args.sockFile
		for a in ['host','port']
			throw "Missing #{a} parameter (or sockFile)" unless args[a]
	# Build FastCGI client
	connector = require 'fastcgi-client'
	params = {}
	if args.PARAMS
		params = args.PARAMS
		delete args.PARAMS
	client = connector args

	run = (req, res, next) ->
		return res.status(500).send 'Not yet ready'
	client.on 'ready', () ->
		run = (req, res, next) ->
			q = req.originalUrl.replace(new RegExp("^#{req.path}\\?*"), '')
			query =
				HOST: req.headers.host
				QUERY_STRING: q
				REQUEST_METHOD: req.method
				CONTENT_LENGTH: '0'
				REQUEST_URI: req.originalUrl
				PATH_INFO: req.path
				SERVER_PROTOCOL: 'HTTP/1.1'
				GATEWAY_INTERFACE: 'CGI/1.1'
				REMOTE_ADDR: req.ip
			for k,v of req.headers
				k = k.toUpperCase().replace /-/g, '_'
				query["HTTP_#{k}"] = v
			for k,v of params
				k = k.toUpperCase()
				query[k] = v
			client.request query, (err, freq) ->
				return res.status(500).send err if err
				resp = ''
				freq.stdout.on 'data', (data) ->
					resp += data.toString()
				freq.stdout.on 'end', ->
					# TODO read status, set headers, in req.upstream...
					lines = resp.split /\r?\n/
					headers = {}
					for l in lines
						if l.match /^(.*?): (.*)$/
							v = RegExp.$2
							k = RegExp.$1.toLowerCase()
							headers[k] = v
					code = parseInt headers.status.replace /\s.*$/, ''
					if headers.location and (code == 401 or code == 302)
						return res.redirect headers.location
					else if code < 300
						req.upstreamHeaders = headers
						return next()
					else
						return res.status(code).send headers.status
		console.log 'Ready'

	handler = (req, res, next) ->
		return run req, res, next
	return handler
