const CONFIG = require('./config/config');

// LOGGER
const logger = require('./basic-logger');
logger.info(CONFIG);

// RESTIFY
const restify = require('restify');
const router = new (require('restify-router')).Router();
const server = restify.createServer({
	name: CONFIG.app_name,
	version: CONFIG.app_version,
});
server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 2,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));
// http://restify.com/docs/plugins-api/
server.use(restify.plugins.bodyParser()); 							
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
// TODO: probably need to add CORS support
// https://github.com/restify/node-restify/issues/1151

// ROUTES
const v1 = require('./routes/V1');
router.add('/api/v1', v1);
router.applyRoutes(server);

// DATABASE
const models = require("./models");
models.sequelize.authenticate().then(() => {
	console.log('Connected to SQL database.');
})
.catch(err => {
    console.error('Unable to connect to SQL database.', err);
});

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(CONFIG.app_port, CONFIG.app_host, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});