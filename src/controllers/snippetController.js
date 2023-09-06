const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const { Storage } = require("@google-cloud/storage");

const { GCLOUD_PROJECT_ID, BUCKET_NAME } = process.env;

const keyFilePath = path.join(__dirname, "../../gcloud-credentials.json");

const storage = new Storage({
  projectId: GCLOUD_PROJECT_ID,
  keyFilename: keyFilePath,
});

exports.beautifyController = async (req, res) => {
  try {
    const code = 'console.log("Hello, World!");';
    const language = "javascript";
    const theme = "seti";
    const fontSize = 14;
    const backgroundColor = "#282c34";

    const filename = `${uuidv4()}.png`;
    const carbonCommand = `npx carbon-now-cli "${filename}" -t "${theme}" -l "${language}" -b "${backgroundColor}" -f "${fontSize}"`;

    exec(carbonCommand, { input: code }, async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ error: "An error occurred." });
        return;
      }
      const imageBuffer = await fs.promises.readFile(filename);
      fs.unlinkSync(filename);

      const remoteFilePath = `code_images/${path.basename(filename)}`;
      const uploadOptions = {
        destination: remoteFilePath,
        contentType: "image/png",
      };

      await storage.bucket(BUCKET_NAME).upload(filename, uploadOptions);

      const gcsUri = `gs://${BUCKET_NAME}/${remoteFilePath}`;
      console.log(gcsUri);
      res.json({ image_url: gcsUri, message: "success" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
};
