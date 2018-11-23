require('dotenv').config();//instatiate environment variables
let CONFIG = {} //Make this global to use all over the application

CONFIG.app_name     = process.env.APP_NAME      || 'app';
CONFIG.app_version  = process.env.APP_VERSION   || '1.0.0';
CONFIG.app_host     = process.env.app_host      || 'localhost';
CONFIG.app_port     = process.env.APP_PORT      || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '32000';
CONFIG.db_name      = process.env.DB_NAME       || 'students_dev';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'password';

module.exports = CONFIG;