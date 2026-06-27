const { uploadFile, getSignedFileUrl } = require("../services/s3Service");
const File = require("../models/file");

exports.upload = async (req, res) => {
  try {
    console.log(req.file);
    console.log(process.env.AWS_BUCKET_URL);
    console.log(typeof req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const key = `${Date.now()}-${file.originalname}`;
    console.log(Date.now());

    await uploadFile(file, key);
    const fileUrl = await getSignedFileUrl(key);

    await File.create({
      key,
      fileUrl,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });

    console.log(fileUrl, "this is the signed URL");
    res
      .status(201)
      .json({ message: "File uploaded successfully", key, fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
