# Use the official image as a parent image.
FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app

# Set the working directory.
WORKDIR /usr/src/app

# Copy all of your app's source code from your host to your image filesystem.
COPY . .

# Install app dependencies
RUN npm install
