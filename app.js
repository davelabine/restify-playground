require('dotenv').config(); // Instantiate environment variables.

// LOGGER
const logger = require('./util/basic-logger');
// A little too verbose...
// logger.info(process.env);  

const passport = require('passport-restify');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models').User;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

// RESTIFY
const restify = require('restify');
const router = new (require('restify-router')).Router();
var CookieParser = require('restify-cookies');
var session = require('cookie-session');
const server = restify.createServer({
	name: process.env.APP_NAME,
	version: process.env.APP_VERSION,
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
//server.use(restify.requestLogger());
server.use(CookieParser.parse);
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

// DATABASE
const models = require("./models");
models.sequelize.authenticate().then(() => {
	logger.info('Connected to SQL database.');
})
.catch(err => {
    logger.error('Unable to connect to SQL database.', err);
});

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});