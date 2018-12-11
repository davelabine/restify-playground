const axios = require('axios');
const logger = require('../basic-logger');

module.exports.putJobProcessed = function(id) { 
    let body = {
        processed: true,
    }
    let url = 'http://localhost:8080/api/v1/job/' + id;
    axios({
        method: 'put',
        url: url,
        data: body
    })
    .then(function (response) {
        logger.info("putJobProcessed response - ", response.status);
    })
    .catch(function (err) {
        logger.error(err)
    });
};
