FROM mhart/alpine-node:8

# Setup
WORKDIR /src

# Install deps
COPY package.json /src/
Run npm install
Run node --version

ADD . /src

EXPOSE 80

CMD ["npm", "start"]
