# alfrink-calendar

Webscraper for the [Alfrink calendar](https://www.alfrink.nl/agenda)

## Run using docker

```bash
docker build -t alfrink-calendar .
docker run -p 8592:3000 --name alfrink-cal -e "DEBUG_TOKEN=XXX" -e "DB_HOST=XXX" -e "DB_DATABASE=XXX" -e "DB_USERNAME=XXXX" -e "DB_PASSWORD=XXX" -d alfrink-calendar
```

## Contributing

```bash
git clone https://github.com/stingalleman/alfrink-calendar
cd alfrink-calendar
yarn install

tsc . # compile typescript
node dist/index.js # Run the code
```

_____
License: [GNU General Public v3.0](https://github.com/stingalleman/alfrink-calendar/blob/master/LICENSE)
