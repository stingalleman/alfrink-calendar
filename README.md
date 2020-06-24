# alfrink-calendar

Webscraper for the [Alfrink calendar](https://www.alfrink.nl/agenda)

## Run using docker

```bash
docker build -t (USER)/alfrink-calendar .
docker run -p 80:80 -e DB_HOST=(HOST) -e DB_USER=(USER) -e DB_PASS=(PASS) -d (USER)/alfrink-calendar
```

## Contributing

```bash
git clone https://github.com/stingalleman/alfrink-calendar
cd alfrink-calendar
npm install

node src/index.js # Run the code
```

_____
License: [GNU General Public v3.0](https://github.com/stingalleman/alfrink-calendar/blob/master/LICENSE)
