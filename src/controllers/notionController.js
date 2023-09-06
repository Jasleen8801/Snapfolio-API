const AuthSchema = require("../models/auth");
const BlockSchema = require("../models/block");
const { Client } = require("@notionhq/client");
const localStorage = require("localStorage");

const getNotionClient = async () => {
  // const bot_id = localStorage.getItem("bot_id");
  const bot_id = "89bdb28a-4b5e-4a86-af84-1c5801840a56"; // Fetch bot_id as needed
  const auth = await AuthSchema.findOne({ bot_id });

  if (!auth) {
    throw new Error("Authentication not found");
  }

  return new Client({
    auth: auth.access_token,
    notionVersion: "2021-05-13",
  });
};

exports.retrieveABlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    if (await BlockSchema.findOne({ page_id: template_id })) {
      // console.log("Already exists");
      res.send({ message: "Already exists" });
      return;
    }

    const response = await notion.blocks.children.list({
      block_id: template_id,
      page_size: 50,
    });

    const block_ids = response.results.map((result) => result.id);

    const page = new BlockSchema({
      page_id: template_id,
      block_ids: block_ids,
    });
    await page.save();

    res.send({ message: "Successfully fetched the data" });
  } catch (error) {
    console.error("Error in retrieveABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.updateABlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    const block = await BlockSchema.findOne({ page_id: template_id });
    const block_ids = block.block_ids;

    const block_id = block_ids[0];
    const content = "You're hacked! :D ";
    const content1 =
      "This is not a drill! Remember to change your credentials! I repeat, this is not a drill!";

    const response = await notion.blocks.update({
      block_id: block_id,
      paragraph: {
        text: [
          {
            type: "text",
            text: {
              content: content,
            },
            annotations: {
              bold: true,
              color: "red",
            },
          },
          {
            type: "text",
            text: {
              content: content1,
            },
            annotations: {
              italic: true,
              color: "red",
            },
          },
        ],
      },
    });
    // console.log(response);

    res.send({ message: "Successfully updated the data" });
  } catch (error) {
    console.error("Error in updateABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.appendABlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    const block = await BlockSchema.findOne({ page_id: template_id });
    const block_ids = block.block_ids;
    const block_id = block_ids[block_ids.length - 1];

    const response = await notion.blocks.children.append({
      block_id: block_id,
      children: [
        {
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Problem 1",
                },
              },
            ],
          },
        },
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content:
                    "Write a JavaScript function that takes an array of numbers as input and returns the sum of all the even numbers in the array.",
                },
              },
            ],
          },
        },
      ],
    });
    // console.log(response);

    res.send({ message: "Successfully appended the data" });
  } catch (error) {
    console.error("Error in appendABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.retrievePagePropertiesController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    const response = await notion.pages.retrieve({
      page_id: template_id,
    });

    const title = response.properties.title.title;
    // console.log(title);
    res.send({ message: "Successfully fetched the data" });
  } catch (error) {
    console.error("Error in retrievePagePropertiesController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
