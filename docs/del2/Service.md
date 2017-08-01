# Service
Vi skal først sette opp en service. Dette kan du i vårt tilfelle tenke på som applikasjonen vår. Du kan lese mer om servicer [her](https://serverless.com/framework/docs/providers/aws/guide/services/).

- Opprett en ny, tom mappe, på maskinen din og kjør følgende kommando for å lage en service: `sls create --template aws-nodejs --path <selvsagt-service-navn>`
- Du har nå fått opprettet en template til en service, og all konfigurasjon til servicen ligger i filen `serverless.yml`
- Åpne `serverless.yml`, fjern kommentaren for region og endre til ønsket region, for eksempel `eu-central-1`
- Kommenter ut (med `#`) følgende seksjon som omhandler lambda (vi kommer tilbake til dette senere):
```
functions:
  hello:
    handler: handler.hello
```