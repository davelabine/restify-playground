const fs = require('fs');

module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'students_dev',
    host:     '127.0.0.1',
    port:      32000,
    dialect:  'mysql'
  },
  test: {
    username: null,
    password: null,
    database: null,
    host:     null,
    dialect:  'mysql'
  },
  production: {
    username: null,
    password: null,
    database: null,
    host:     null,
    dialect:  'mysql'
  }
};
  /*
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=32000
DB_NAME=students_dev
DB_USER=root
DB_PASSWORD=password


CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'dbNameChange';
CONFIG.db_user      = process.env.DB_USER       || 'rootChange';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'passwordChange';
*/
