# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.8.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY .env .
COPY gcloud_credentials.json .
COPY puppeteer.config.js .

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them into
# this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Install Chromium and additional dependencies using apk
RUN apk --no-cache add \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    && rm -rf /var/cache/* /root/.npm /root/.node-gyp

# Create the cache directory with ownership by root
RUN mkdir -p /usr/src/app/src/controllers/cache
RUN chown -R root:root /usr/src/app/src/controllers/cache  # Ensure root ownership
RUN chmod -R 755 /usr/src/app/src/controllers/cache         # Ensure read, write, and execute permissions

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
# EXPOSE 3000

# Run the application as root.
USER root

CMD ["npm", "start"]
