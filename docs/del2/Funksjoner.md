# Funksjoner
Vi skal, som i del 1, starte med lambdafunksjonen vår. Men i motsetning til i del 1 skal vi denne gangen deploye lambdafunksjonen vår med Serverless Framework.



- Erstatt innholdet i filen `handler.js` med følgende innhold. Dette er den samme funksjonen som ble brukt i del 1. **Merk at `exports.handler` må byttes ut med `module.exports.<navn-på-lambda>`**. Du velger selv hva lambdafunksjonen din skal hete

{% codesnippet "./lambda/todos.js" %} {% endcodesnippet %}

- La foreløpig tabellnavnet stå som det er. Vi skal endre dette i neste steg.
- Finn konfigurasjonsdelen for funksjoner i `serverless.yml`, fjern kommentarene vi la inn i stad, og erstatt `hello` med navnet på lambdafunksjonen din

---

## Tilganger

For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under seksjonen *Permissions* i dokumentasjonen til  [Functions](https://serverless.com/framework/docs/providers/aws/guide/functions) for hvordan dette gjøres.

---

## Deploy funksjonen
Da er vi klare for å deploye funksjonen vår til AWS. Kjør `sls deploy`, vent til den er ferdig og sjekk i AWS consollet at lambdafunksjonen din har blitt opprettet korrekt.

>**Hva skjedde nå?**
>Det som skjedde var at Serverless Framework pakker `serverless.yml` samt koden til lambdafunksjonen i en zip-fil og laster dette opp til en S3-bucket i AWS. Basert på `serverless.yml` vil rammeverket opprettet en såkalt CloudFormation template som beskriver alle ressursene vi ønsker å opprette. Deretter vil CloudFormation kjøre og opprette lambdafunksjonen.

### Test funksjonen
TODO: Ta med testing av funksjonen gjennom sls