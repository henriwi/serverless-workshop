# Service
Det første vi skal sette opp med Serverless Framework er en *service*. En service kan du se på som et *prosjekt*, et sted hvor du definerer funksjonene dine, hvilke eventer som trigger dem og hvilke ressurser funksjonene dine bruker.

>Hvis du vil vite mer om servicer kan du lese om dette [her](https://serverless.com/framework/docs/providers/aws/guide/services/).

Opprett en ny, tom mappe, på maskinen din (den kan hete hva du ønsker). Naviger til mappen og kjør følgende kommando for å lage en service: `sls create --template aws-nodejs --path <selvvalgt-service-navn>`

Serverless Frameowrk har nå laget en ny mappe som inneholder et par filer.

- `serverless.yml` inneholder all konfigurasjon til servicen din
- `handler.js` inneholder en eksempelfunksjon som rammeverket lager for oss

Før vi går videre må du gjøre én ting i `serverless.yml`.

- Naviger til mappen og åpne `serverless.yml`
- Fjern kommentaren for region og endre til ønsket region, for eksempel `eu-central-1`

Nå som servicen vår har blitt opprettet, er vi klare for å opprette de ulike ressursene som applikasjonen vår består av.
