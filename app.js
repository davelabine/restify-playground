const CONFIG = require('./config/config');
const logger = require('./basic-logger');
logger.info(CONFIG);

const restify = require('restify');
const router = new (require('restify-router')).Router();
const server = restify.createServer({
	name: CONFIG.app_name,
	version: CONFIG.app_version,
});

const home = require('./routes/index');
const students = require('./routes/students');

server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 2,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());

router.add('/api', home);
router.add('/api/students', students);
router.applyRoutes(server);

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(CONFIG.app_port, CONFIG.app_host, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});