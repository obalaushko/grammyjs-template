
# Simple grammyJS Template

This repository provides a template for creating Telegram bots using the [grammY](https://grammy.dev/) framework with Deno. It includes support for MongoDB Atlas, Docker, and a basic CI/CD pipeline for building and pushing Docker images to Docker Hub.

## Features

- **Deno**: This template uses [Deno](https://deno.land/), a modern runtime for JavaScript and TypeScript.
- **MongoDB Atlas Support**: The bot has an optional configuration to connect to MongoDB Atlas for storing bot-related data.
- **Docker Support**: A Dockerfile is provided for containerizing your application.
- **GitHub Actions CI/CD**: The repository includes a GitHub Actions workflow for automatically building and pushing a Docker image to Docker Hub whenever changes are pushed to the `master` branch.

## Setup Instructions

### Step 1: Clone the repository

```bash
git clone https://github.com/obalaushko/grammyjs-template.git
cd grammyjs-template
```

### Step 2: Set up environment variables

1. Copy the `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

2. Update the `.env` file with your own values. Below is a description of each environment variable:

#### Environment Variables

- `DENO_ENV`: Set to `development` or `production` to indicate the current environment.
  
#### Database (MongoDB Atlas)

- `USE_MONGO`: Set this to a MongoDB connection string if you are using MongoDB. Leave it empty if MongoDB is not needed.
- `MONGO_DB`: MongoDB Atlas connection string.
- `MONGO_DB_USER`: MongoDB user.
- `MONGO_DB_PASSWORD`: MongoDB password.
- `MONGO_DB_NAME`: Name of the database.
- `MONGO_DB_HOST`: MongoDB host.

#### Bot Metadata

- `BOT_NAME`: The name of your Telegram bot.
- `BOT_TOKEN`: API token for your bot from [BotFather](https://core.telegram.org/bots#botfather).
- `DEVELOPMENT_BOT_TOKEN`: Token for testing the bot in a development environment.
- `ADMIN_ID`: The Telegram ID of the bot administrator.
- `GROUP_ID`: Telegram group ID where the bot operates.
- `WEB_APP_URL`: The URL of the web application or bot endpoint (if applicable).
- `PORT`: The port number for your bot server.
- `DEBUG`: Set to `grammy*` to enable debugging logs for grammY.

### Step 3: Run the project locally

To start the development server, run the following command:

```bash
deno task dev
```

This will start the bot in development mode with hot-reload enabled.

### Step 4: Docker Setup

The repository includes a simple Docker configuration to run your Deno bot in a container.

#### Dockerfile

The Dockerfile is configured to install Deno, copy your project, and run it inside a container. Below is the content of the provided `Dockerfile`:

```Dockerfile
FROM denoland/deno:latest

WORKDIR /app

COPY deno.json .
COPY . .

# EXPOSE 3000

CMD ["task", "start"]
```

#### Build and Run with Docker

To build the Docker image and run it locally:

```bash
docker build -t your-bot-name .
docker run -d -p 3000:3000 your-bot-name
```

### Step 5: CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow for building and pushing a Docker image to Docker Hub when changes are pushed to the `master` branch.

#### GitHub Actions Workflow

Here's the `.github/workflows/docker-image.yml` file:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - master

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/YOUR_NAME_REPO:latest

      - name: Log out from Docker Hub
        run: docker logout
```

This workflow will:

1. **Build the Docker image**: Builds the image using the repository code.
2. **Push the image to Docker Hub**: The image will be tagged and pushed to your Docker Hub repository.
3. **Run the CI/CD pipeline**: Each time code is pushed to the `master` branch, the workflow is triggered.

#### Set up GitHub Secrets

Before using this workflow, make sure to add the following secrets in your GitHub repository settings:

- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_TOKEN`: A Docker Hub token generated for pushing images to your repository.

---

That's it! You now have a simple Deno + grammY Telegram bot template with MongoDB Atlas support, Docker integration, and a GitHub Actions pipeline to build and deploy Docker images.
