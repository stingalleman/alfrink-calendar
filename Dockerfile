FROM node:latest

ENV DB_HOST localhost
ENV DB_USER root
ENV DB_PASS password
ENV DB_AUTHSOURCE admin

RUN apt-get update

# puppeteer dependencies
RUN apt-get install -yyq ca-certificates fonts-liberation gconf-service lsb-release wget xdg-utils libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6

WORKDIR /usr/src/alrink-cal

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 80

CMD [ "npm", "start" ]