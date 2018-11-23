const CONFIG = require('./config/config');
const bunyan = require('bunyan');
const fs = require('fs');

// For dev logging to stdout
module.exports = bunyan.createLogger({name: CONFIG.app_name});

/* For prod logging to files

   TODO: Configure this for different tiers with config values.

// create logs directory if not exists.
fs.existsSync('logs') || fs.mkdirSync('logs');

module.exports = bunyan.createLogger({
	name: 'restify-playground',
	streams: [{
		type: 'rotating-file',
		path: 'logs/info.log',
		period: '1d',
		level: 'info',
		count: 3
	}, {
		type: 'rotating-file',
		path: 'logs/error.log',
		period: '1d',
		level: 'error',
		count: 7
	}, {
		type: 'rotating-file',
		path: 'logs/trace.log',
		period: '1d',
		level: 'trace',
		count: 3
	}]
});
*/