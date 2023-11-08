const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");

const createGithubGist = require("../utils/createGist");
const generateCarbonUrl = require("../utils/generateCarbonUrl");
const captureScreenshot = require("../utils/captureScreenshot");

const { GCLOUD_PROJECT_ID, BUCKET_NAME } = process.env;

const keyFilePath = path.join(__dirname, "../../gcloud_credentials.json");
const cacheFolderPath = path.join(__dirname, "cache");

if (!fs.existsSync(cacheFolderPath)) {
  fs.mkdirSync(cacheFolderPath);
}

const storage = new Storage({
  projectId: GCLOUD_PROJECT_ID,
  keyFilename: keyFilePath,
});

async function captureAndUploadScreenshot(
  code,
  type,
  theme,
  fontSize,
  backgroundColor,
  res
) {
  try {
    if (!code) {
      return res
        .status(400)
        .json({ error: "Code is required in the request body." });
    }

    const gistFiles = {
      "code.js": {
        content: code,
      },
    };
    const gistId = await createGithubGist(gistFiles);

    const carbonUrl = generateCarbonUrl(
      gistId,
      "auto",
      theme,
      fontSize,
      backgroundColor
    );

    const filename = `${uuidv4()}.png`;
    const tempFilePath = path.join(cacheFolderPath, filename);

    await captureScreenshot(carbonUrl, tempFilePath);

    const remoteFilePath = `${type}_images/${filename}`;

    const uploadOptions = {
      destination: remoteFilePath,
      contentType: "image/png",
    };
    await storage.bucket(BUCKET_NAME).upload(tempFilePath, uploadOptions);

    const gcsUri = `https://storage.googleapis.com/${BUCKET_NAME}/${remoteFilePath}`;

    res.json({ image_url: gcsUri, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
}

exports.codeController = async (req, res) => {
  await captureAndUploadScreenshot(
    req.body.code,
    "code",
    req.body.theme || "seti",
    req.body.fontSize || 14,
    req.body.backgroundColor || "#282c34",
    res
  );
};

exports.outputController = async (req, res) => {
  await captureAndUploadScreenshot(
    req.body.code,
    "output",
    req.body.theme || "seti",
    req.body.fontSize || 14,
    req.body.backgroundColor || "#282c34",
    res
  );
};
