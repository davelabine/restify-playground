const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
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
        const keyName = uuidv1() + ext;

        var fileStream = fs.createReadStream(filePath);
        fileStream.on('error', function(err) {
          logger.error('blobclient file Error', err);
        });
        
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

    const deleteFile = async(fileUrl) => {
        let keyName = path.basename(fileUrl);
        logger.info("keyname: ", keyName);
        let err, resp;
        [err, resp] = await to(s3.deleteObject({
            Bucket: bucketName,
            Key: keyName,
        }).promise());
          if(err) return logger.error("S3 delete error ", err, err.stack);
          
        logger.info('s3 delete successful.');
    }

    return {
        putFile,
        deleteFile
    };
};
