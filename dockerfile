FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200
