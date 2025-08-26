# Dockerfile for an Angular frontend application
FROM node:20-slim

WORKDIR /app

# Install build tools and Angular CLI
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g @angular/cli 

COPY . /app

# Install dependencies (if package.json exists)
RUN if [ -f package.json ]; then npm install; fi
