const axios = require('axios');

module.exports.putJobProcessed = function(id) { 
    let body = {
        processed: true,
    }
    let url = 'http://localhost:8080/api/v1/job/' + id;
    return axios({
        method: 'put',
        url: url,
        data: body
    })
};
