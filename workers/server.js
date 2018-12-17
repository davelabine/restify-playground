require('dotenv').config(); // Instantiate environment variables.
const jobWorker = require('./jobworker');

jobWorker.startJobWorker();