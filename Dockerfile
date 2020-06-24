FROM node:latest

ENV DB_HOST localhost
ENV DB_USER root
ENV DB_PASS
ENV DB_AUTHSOURCE admin

ENV PORT 1334

WORKDIR /usr/src/alrink-cal

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 1223

CMD [ "npm", "start" ]