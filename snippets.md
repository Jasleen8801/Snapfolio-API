```bash
exports.beautifyController = async (req, res) => {
  try {
    const code = 'console.log("Hello, World!");';
    const language = "javascript";
    const theme = "seti";
    const fontSize = 14;
    const backgroundColor = "#282c34";

    const filename = `${uuidv4()}.png`;
    const carbonCommand = `npx carbon-now-cli "${filename}" -t "${theme}" -l "${language}" -b "${backgroundColor}" -f "${fontSize}" -o "${filename}"`; // Added -o option for specifying the output filename

    exec(carbonCommand, { input: code }, async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ error: "An error occurred." });
        return;
      }

      // Define the full path to the generated PNG file
      const tempFilePath = path.join(__dirname, filename);

      // Move the generated file to the desired location
      const remoteFilePath = `code_images/${filename}`;
      fs.renameSync(filename, tempFilePath);

      const uploadOptions = {
        destination: remoteFilePath,
        contentType: "image/png",
      };

      await storage.bucket(BUCKET_NAME).upload(tempFilePath, uploadOptions);

      const gcsUri = `gs://${BUCKET_NAME}/${remoteFilePath}`;
      console.log(gcsUri);
      res.json({ image_url: gcsUri, message: "success" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
};
```
