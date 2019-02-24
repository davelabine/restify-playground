const fs = require('fs');

module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'students_dev',
    host:     '127.0.0.1',
    port:      32000,
    dialect:  'mysql',
    operatorsAliases: false,
  },
  test: {
    username: null,
    password: null,
    database: null,
    host:     null,
    dialect:  'mysql',
    operatorsAliases: false,
  },
  production: {
    username: null,
    password: null,
    database: null,
    host:     null,
    dialect:  'mysql',
    operatorsAliases: false,
  }
};

