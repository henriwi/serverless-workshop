# Del 2 – Oppsett med [Serverless framework](https://serverless.com)

I del 2 av workshopen skal vi benytte Serverless Framework til å deploye store deler av applikasjonen vår.
Serverless Framework er dokumentert [her](https://serverless.com/framework/docs/).

## Installer Serverless Framework
- Installer serverless ved å kjøre `npm install -g serverless`
- Når installasjonen er ferdig kan du verifisere at Serverless Framework er installert ved å kjøre kommandoen `serverless` eller `sls` (`sls` er en snarvei for `serverless`)

## Sett opp AWS Credentials

For å gi Serverless Framework mulighet til å opprette ressurser i AWS, må vi sette opp AWS credentials som vi setter som miljøvariabler i terminalen.

- I AWS Console, klikk på brukernavnet ditt øverst til høyre og velg *Security Credentials*
- Hvis det kommer opp en dialog som sier *You are accessing the security credentials (...)* velg *Continue to Security Credentials*
- Velg *Access Keys* og trykk på knappen *Create New Access Key*
- Last ned nøklene og eksporter disse som miljøvariabler i terminalen ved å kjøre følgende kommandoer:

	```
	export AWS_ACCESS_KEY_ID=<your-key-here>
	export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
	```

Hvis du støter på problemer, kan du se på dokumentasjon til hvordan man setter opp AWS Credentials med Serverless Framework [her](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

## Service
Vi skal først sette opp en service. Dette kan du i vårt tilfelle tenke på som applikasjonen vår. Du kan lese mer om servicer [her](https://serverless.com/framework/docs/providers/aws/guide/services/).

- Opprett en ny, tom mappe, på maskinen din og kjør følgende kommando for å lage en service: `sls create --template aws-nodejs --path <selvsagt-service-navn>`
- Du har nå fått opprettet en template til en service, og all konfigurasjon til servicen ligger i filen `serverless.yml`
- Åpne `serverless.yml`, fjern kommentaren for region og endre til ønsket region, for eksempel `eu-central-1`

## DynamoDB
Vi skal, som i del 1, starte med å sette opp en DynamoDB-tabell. Dette gjøres ved å definere en såkalt CloudFormation-template i `serverless.yml`. Du kan lese mer om dette [her](https://serverless.com/framework/docs/providers/aws/guide/resources/).

- Sett opp en DynamoDB-tabell under `resources` i `serverless.yml`. Tabellen skal være helt lik den vi lagde i del 1
	- Tabellnavn i DynamoDB er unike, bruk derfor et annet navn enn i del 1
	- Attributtene til tabellene defineres i `AttributeDefinitions`
  - `PrimaryKey` og `SortKey` defineres i `KeySchema`
  - Du kan lese mer om oppsett av DynamoDB-tabeller med CloudFormation [her](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html)

### Deploy databasen
Kjør `sls deploy` for å deploye tjenesten med det som er definert av ressurser hittil. Verifiser at DynamoDB-tabellen din har blitt opprettet korrekt.

## Funksjoner
Vi skal nå ta for oss lambdafunksjonen vi lagde i del 1, og deploye denne med serverless-rammeverket i stedet. Du kan lese mer om funksjoner [her](https://serverless.com/framework/docs/providers/aws/guide/functions/).

1. Erstatt innholdet i filen `handler.js` med innholdet i fila `lamda/index,js`, som vi brukte til lambdafunksjonen i del 1. Merk at `exports.handler` må byttes ut med `module.exports.<navn-på-lambda>`. Du velger selv hva lambdafunksjonen din skal hete.
2. Erstatt tabellnavnet i lambda-koden med navnet på tabellen du definerte i forrige steg
3. Finn konfigurasjonsdelen for funksjoner i `serverless.yml` og erstatt `hello` med navnet på lambdafunksjonen din

### Deploy funksjonen
Kjør `sls deploy` igjen, og verifiser at lambdafunksjonen har blitt opprettet korrekt.

## Events

Som i del 1 skal vi trigge lambdaen via API Gateway. Les om hvordan dette gjøres [her](https://serverless.com/framework/docs/providers/aws/events/apigateway/).

1. Vi ønsker å sette opp integrasjonen med `Lambda Proxy Integration`
2. For at API-gatewayen skal fungere med Frontenden vår og CloudFront er det viktig at pathen til ressursen i APIet er `/api` , på samme måte som i del 1.

### Deploy gateway
Kjør `sls deploy` igjen, og verifiser at API-gatewayen har blitt opprettet korrekt.

## Tilganger

For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under seksjonen *Permissions* i dokumentasjonen til  [Functions](https://serverless.com/framework/docs/providers/aws/guide/functions) for hvordan dette gjøres.

## Deploy hele servicen
Da har vi definert alle delene av applikasjonen vår bortsett fra S3 og CloudFront. Dette gjør vi manuelt gjennom AWS Console etterpå.

1. Kjør `sls deploy` igjen for å deploye hele services din
2. Verifiser at de ulike ressursene (DynamoDB, API Gateway og Lambda) har blitt opprettet korrekt

## Test
Serverless Framework kommer med en del muligheter for å teste tjenesten din, samt hente ut ulike metrikker og lese logger.
For en fullstendig oversikt over kommandoene som Serverless Framework tilbyr, se [her](https://serverless.com/framework/docs/providers/aws/cli-reference/).

Test ut følgende kommandoer (og gjerne flere) mot tjenesten du nettopp har deployet:

- `sls info` skriver ut informasjon om tjenesten du har deployet, inkludert URL-en til APIet ditt.
- `sls invoke -f <navn-på-lambda>` vil eksekvere en spesifikk lambdafunksjon direkte (utenom API Gateway).
- `sls logs -f <navn-på-lambda>` printer loggene til en gitt lambdafunksjon. Dette er nyttig ved f.eks. feilsøking.
- `sls metrics` gir grunnleggende metrikker om tjenesten din
- `sls metrics -f <navn-på-lambda>` gir metrikker om en spesifikk lambda

## Frontend og CloudFront
Frontenden vår går fortsatt til det gamle API-et vårt. Nå skal vi gå inn i CloudFront og endre routingen slik at `/api` peker til vår nyopprettede API Gateway istedenfor den gamle.

- Opprett en ny *origin* for API-et vi har deployet med Servlerless Framework. Dette gjøres på samme måte som i del 1
- Endre *behaviour* slik at trafikk på `/api` blir routet til den nye *origin*, og dermed til vårt nye API

Når du nå tester frontenden skal CloudFront route forespørslene til den nye API-gatewayen, og hente data fra en ny DynamoDB-tabell. Test at dette virker ved at Todo-listen nå er tom, og at du fortsatt får lagt inn og slettet elementer.

## Rydde opp

Før du går for dagen må du fjerne alle komponentene vi har satt opp.

_ `sls remove` fjerner alle ressursene som har blitt satt opp med Serverless Framework
