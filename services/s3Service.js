const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("../config/s3client");

const parseSignedUrlExpiry = (value) => {
  if (value === undefined || value === null || value === "") {
    return 60;
  }

  const rawValue = String(value).trim();
  const match = rawValue.match(/^(\d+)(ms|s|m|h)?$/i);

  if (!match) {
    return 60;
  }

  const amount = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();

  switch (unit) {
    case "ms":
      return Math.max(1, Math.ceil(amount / 1000));
    case "m":
      return amount * 60;
    case "h":
      return amount * 60 * 60;
    case "s":
    default:
      return amount;
  }
};

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

const getSignedFileUrl = async (
  key,
  expiresIn = parseSignedUrlExpiry(process.env.S3_SIGNED_URL_EXPIRES_IN)
) => {
  const signedUrlParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  return await getSignedUrl(s3Client, new GetObjectCommand(signedUrlParams), {
    expiresIn
  });
};

module.exports = { uploadFile, deleteFile, getSignedFileUrl };
