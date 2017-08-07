# Service
Det første vi skal sette opp med Serverless Framework er en *service*. En service kan du i vårt tilfelle anse som selve applikasjonen vår.

>Hvis du vil vite mer om servicer kan du lese om dette [her](https://serverless.com/framework/docs/providers/aws/guide/services/).

- Opprett en ny, tom mappe, på maskinen din (den kan hete hva du ønsker). Naviger til mappen og kjør følgende kommando for å lage en service: `sls create --template aws-nodejs --path <selvsagt-service-navn>`

---

Du har nå fått opprettet en template til en service, og all konfigurasjon til servicen ligger i filen `serverless.yml`. Åpne den opp å ta en titt!

Før vi går videre må du gjøre to ting i `serverless.yml`:

1. Fjern kommentaren for region og endre til ønsket region, for eksempel `eu-central-1`
2. Kommenter ut (med `#`) følgende seksjon som omhandler *functions* da vi kommer tilbake til dette snart. Med kommentarer bør *functions*-blokken se slik ut:
```
#functions:
#  hello:
#    handler: handler.hello
```

Nå som servicen vår har blitt opprettet, er vi klare for å opprette de ulike ressursene som applikasjonen vår består av.