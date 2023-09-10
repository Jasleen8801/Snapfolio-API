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

exports.beautifyController = async (req, res) => {
  try {
    const code = 'console.log("Hell Yeah this worksssss!");';
    const language = "javascript";
    const theme = "seti";
    const fontSize = 14;
    const backgroundColor = "#282c34";

    const gistFiles = {
      'example.js': {
        content: code,
      },
    };
    
    const gistId = await createGithubGist(gistFiles);
    const carbonUrl = generateCarbonUrl(gistId, language, theme, fontSize, backgroundColor);

    const filename = `${uuidv4()}.png`;
    const tempFilePath = path.join(cacheFolderPath, filename);
    await captureScreenshot(carbonUrl, tempFilePath);
    const remoteFilePath = `code_images/${filename}`; 

    const uploadOptions = {
      destination: remoteFilePath,
      contentType: "image/png",
    };

    await storage.bucket(BUCKET_NAME).upload(tempFilePath, uploadOptions);

    const gcsUri = `https://storage.cloud.google.com/${BUCKET_NAME}/code_images/${remoteFilePath}`;
    console.log(gcsUri);
    res.json({ image_url: gcsUri, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

