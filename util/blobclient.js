const AWS = require('aws-sdk');
const fs = require('fs');
const uuid = require('node-uuid');
const { to }  = require('./util');  
const logger = require('./basic-logger');

module.exports = () => {
    // Set the region 
    AWS.config.update({region: process.env.AWS_REGION});
    // Create S3 service object
    s3 = new AWS.S3();
    // Create a bucket and upload something into it
    const bucketName = process.env.AWS_S3_PHOTO_BUCKET;

    const putFile = async (filePath, ext) => {
        if (!filePath) {
            throw new Error("blobclient putFile - empty file path.");
        }
        logger.info('path: %s, ext: %s', filePath, ext);
        const keyName = uuid.v4() + ext;
        logger.info('keyname: ', keyName);

        var fileStream = fs.createReadStream(filePath);
        fileStream.on('error', function(err) {
          logger.error('blobclient file Error', err);
        });
        
        logger.info('put into S3');
        let resp;
        [err, resp] = await to(s3.upload({
            Bucket: bucketName,
            Key: keyName,
            Body: fileStream,
            ACL: 'public-read'
        }).promise());
          if(err) return logger.error("S3 upload error ", err, err.stack);
        
        logger.info('s3 upload response: ', resp.Location);
        return resp.Location;
    };

    return {
        putFile,
    };
};
