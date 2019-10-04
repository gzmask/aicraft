FROM node:0.10

WORKDIR /usr/src/app

ADD package.json .

RUN npm install

COPY . .

EXPOSE 3003

CMD ["./aicraft_server.js"]