require('dotenv').config(); // Instantiate environment variables.

// LOGGER
const logger = require('./util/basic-logger');
// A little too verbose...
// logger.info(process.env);  

// RESTIFY
const restify = require('restify');
const router = new (require('restify-router')).Router();
const passport = require('passport-restify');
var sessions = require("client-sessions");
const server = restify.createServer({
	name: process.env.APP_NAME,
	version: process.env.APP_VERSION,
});
server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 2,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));

const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
  origins: ['*']
})
server.pre(cors.preflight)
server.use(cors.actual)

// Handy link - https://stackoverflow.com/questions/32250185/client-sessions-module-with-passportjs/53574377#53574377
server.use(sessions({
	cookieName: 'session', // Passport expects this cookie name to be added to the request object.
	secret: 'blargadeeblargblarg', // should be a large unguessable string
	duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
	activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  }));
// http://restify.com/docs/plugins-api/
server.use(restify.plugins.bodyParser()); 							
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.requestLogger());
server.use(passport.initialize());
server.use(passport.session());
// TODO: probably need to add CORS support
// https://github.com/restify/node-restify/issues/1151

// STATIC DIRECTORY
server.get(
	'/',
	restify.plugins.serveStatic({
	  directory: './static',
	  default: 'index.html'
	})
  );

// ROUTES
const v1 = require('./routes/V1');
router.add('/api/v1', v1);
router.applyRoutes(server);

/* Useful for debugging.
server.on('after', restify.plugins.auditLogger({
	log: logger,
	event: 'after'
  }));
*/

// DATABASE
// Note: disabled env flag to simplify new deployments.
const models = require("./models");
if (!process.env.APP_DB_DISABLED) {
	models.sequelize.authenticate().then(() => {
		logger.info('Connected to SQL database.');
	})
	.catch(err => {
		logger.error('Unable to connect to SQL database.', err);
	});
}



server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.info(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});