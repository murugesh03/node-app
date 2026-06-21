const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = require("../config/s3client");

const uploadFile = async (file, key) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  return await s3Client.send(new PutObjectCommand(uploadParams));
};

const deleteFile = async (key) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  return await s3Client.send(new DeleteObjectCommand(deleteParams));
};

module.exports = { uploadFile, deleteFile };
