FROM node:10.15.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN apt-get update && \
  apt-get install -y build-essential

RUN yarn install

# Set environment variables
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 1337

# Bundle app source
COPY . /usr/src/app

EXPOSE 1337
CMD [ "yarn", "start" ]
