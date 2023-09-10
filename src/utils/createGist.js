const { Octokit } = require("@octokit/rest");
const dotenv = require("dotenv");
dotenv.config();

const { GITHUB_ACCESS_TOKEN } = process.env;

const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

async function createGithubGist(files) {
	try {
		const response = await octokit.gists.create({
			files: files,
			public: true,
		});
		return response.data.id;
	} catch (error) {
		console.log(error);
		return null;
	}
}

module.exports = createGithubGist;