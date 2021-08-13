# our base image
FROM node:16

# specify the port number the container should expose
EXPOSE 3000
EXPOSE 3001
EXPOSE 3010

# Update APT
RUN apt-get update && apt-get upgrade -y
RUN apt-get install build-essential

# Run update and Strongloop install
RUN npm install -g npm
RUN npm install -g @loopback/cli

# Create APP shared folder
RUN mkdir /app
