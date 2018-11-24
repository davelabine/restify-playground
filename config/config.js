require('dotenv').config();//instatiate environment variables
let CONFIG = {} //Make this global to use all over the application

CONFIG.app_name     = process.env.APP_NAME      || 'app';
CONFIG.app_version  = process.env.APP_VERSION   || '1.0.0';
CONFIG.app_host     = process.env.APP_HOST      || 'localhost';
CONFIG.app_port     = process.env.APP_PORT      || '3000';

module.exports = CONFIG;