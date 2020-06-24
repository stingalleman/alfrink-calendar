FROM node:latest

WORKDIR /usr/src/alrink-cal

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 1223

CMD [ "npm", "start" ]