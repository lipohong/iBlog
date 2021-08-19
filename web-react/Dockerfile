# Use the official image as a parent image.
FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app

# Set the working directory.
WORKDIR /usr/src/app

# Copy all of your app's source code from your host to your image filesystem.
COPY . .

# Inform Docker that the container is listening on the specified port at runtime.
# EXPOSE 3001

# Install app dependencies
RUN npm install
RUN npm run build

# Run the specified command within the container.
# CMD [ "npm", "start" ]