# SnapFolio API
This API allows you to create, read, update notes in Notion, and is exclusively used by SnapFolio.

SnapFolio is a VS Code extension that allows you to write the documentation of your project or college assignment on your Notion Page directly from VS Code. 

## Setup

1. Clone the repo

    ```bash
    git clone https://github.com/Jasleen8801/Snapfolio-API.git
    ```

2. Setting Envrionment Variables

    Create a `.env` file in the root directory of the project and add the following variables:

    ```bash
    NOTION_SECRET=<your-notion-secret>
    NOTION_PAGE_ID=<your-notion-page-id>
    NOTION_API_BASE_URL="https://api.notion.com/v1"
    OAUTH_CLIENT_ID=<your-oauth-client-id>
    OAUTH_CLIENT_SECRET=<your-oauth-client-secret>
    AUTHORIZATION_URL=<your-authorization-url>
    MONGODB_URI=<your-mongodb-uri>
    PORT=3000
    GCLOUD_PROJECT_ID=<your-gcloud-project-id>
    BUCKET_NAME=<your-bucket-name>
    GITHUB_ACCESS_TOKEN=<your-github-access-token>
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Setup Google Cloud Storage

    - Create a Google Cloud Storage bucket
    - Create a service account and download the JSON file
    - Rename the JSON file to `gcloud_credentials.json` and place it in the root directory of the project

5. Setup MongoDB

    - Create a MongoDB Atlas cluster
    - Create a database and a collection
    - Create a user and add it to the database
    - Add the connection string to the `.env` file

6. Setup Notion

    - Create a Notion integration and keep it public
    - Setup the template page and it to the integration
    - Setup the authorization URL and other variables in the `.env` file

7. Setup Github

    - Create a Github Account if you don't have one
    - Generate a Personal Access Token by going to Settings > Developer Settings > Personal Access Tokens
    - Give it atleast "gist" scope
    - Copy and paste the token in the `.env` file

## Run the API

To run the API, run the following command:
```bash
npm start
```

## API Endpoints

1. `GET /notion/getPages`: Retrieve a list of Notion pages. 
2. `POST /notion/createPage`: Create a new Notion page. 
3. `GET /notion/retrieve`: Retrieve a block from the Notion page.
4. `PATCH /notion/update`: Update a block in the Notion page.
5. `POST /notion/appendText`: Append a text block to the Notion page. 
6. `POST /notion/appendCode`: Append a code block to the Notion page. 
7. `GET /notion/properties`: Retrieve properties of the Notion page.
8. `POST /auth/redirect_uri`: Authenticate the user's Notion account

## Main Repository

This is just the backend API of our main extension. To view the main repository, click [here](https://github.com/Jasleen8801/snapfolio). Be sure to star the repo if you like it!

