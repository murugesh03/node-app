const { uploadFile } = require("../services/s3Service");

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
    await uploadFile(file, key);
    const fileUrl = `${process.env.AWS_BUCKET_URL}/${key}`;
    const saveFile = await File.create({ key, fileUrl });
    res
      .status(201)
      .json({ message: "File uploaded successfully", key, fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
