# Funksjoner
Vi skal nå ta for oss lambdafunksjonen vi lagde i del 1, og deploye denne med serverless-rammeverket i stedet. Du kan lese mer om funksjoner [her](https://serverless.com/framework/docs/providers/aws/guide/functions/).

- Erstatt innholdet i filen `handler.js` med innholdet i fila [`lambda/index.js`](lambda/index.js), som vi brukte til lambdafunksjonen i del 1. Merk at `exports.handler` må byttes ut med `module.exports.<navn-på-lambda>`. Du velger selv hva lambdafunksjonen din skal hete
- Erstatt tabellnavnet i lambda-koden med navnet på tabellen du definerte i forrige steg
- Finn konfigurasjonsdelen for funksjoner i `serverless.yml`, fjern kommentarene vi la inn i stad, og erstatt `hello` med navnet på lambdafunksjonen din

## Tilganger

For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under seksjonen *Permissions* i dokumentasjonen til  [Functions](https://serverless.com/framework/docs/providers/aws/guide/functions) for hvordan dette gjøres.

### Deploy funksjonen
Kjør `sls deploy` igjen, og sjekk i webkonsollet at lambdafunksjonen har blitt opprettet korrekt.