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
- Kommenter ut (med `#`) følgende seksjon som omhandler lambda (vi kommer tilbake til dette senere):
```
functions:
  hello:
    handler: handler.hello
```

## DynamoDB
Vi skal, som i del 1, starte med å sette opp en DynamoDB-tabell. Dette gjøres ved å definere en såkalt CloudFormation-template i `serverless.yml`. Du kan lese mer om dette [her](https://serverless.com/framework/docs/providers/aws/guide/resources/).

- Sett opp en DynamoDB-tabell under `resources` i `serverless.yml`. Tabellen skal være helt lik den vi lagde i del 1
  - Tabellnavn i DynamoDB er unike, bruk derfor et annet navn enn i del 1
  - Attributtene til tabellene defineres i `AttributeDefinitions`
  - `PrimaryKey` og `SortKey` defineres i `KeySchema`. `PrimaryKey` er `HASH` og `SortKey` er `RANGE`.
  - Du kan lese mer om oppsett av DynamoDB-tabeller med CloudFormation [her](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html)

### Deploy databasen
Kjør `sls deploy` for å deploye tjenesten med det som er definert av ressurser hittil. Sjekk i webkonsollet at DynamoDB-tabellen din har blitt opprettet korrekt.

## Funksjoner
Vi skal nå ta for oss lambdafunksjonen vi lagde i del 1, og deploye denne med serverless-rammeverket i stedet. Du kan lese mer om funksjoner [her](https://serverless.com/framework/docs/providers/aws/guide/functions/).

- Erstatt innholdet i filen `handler.js` med innholdet i fila [`lambda/index.js`](lambda/index.js), som vi brukte til lambdafunksjonen i del 1. Merk at `exports.handler` må byttes ut med `module.exports.<navn-på-lambda>`. Du velger selv hva lambdafunksjonen din skal hete
- Erstatt tabellnavnet i lambda-koden med navnet på tabellen du definerte i forrige steg
- Finn konfigurasjonsdelen for funksjoner i `serverless.yml`, fjern kommentarene vi la inn i stad, og erstatt `hello` med navnet på lambdafunksjonen din

### Deploy funksjonen
Kjør `sls deploy` igjen, og sjekk i webkonsollet at lambdafunksjonen har blitt opprettet korrekt.

## Events

Som i del 1 skal vi trigge lambdaen via API Gateway. Les om hvordan dette gjøres [her](https://serverless.com/framework/docs/providers/aws/events/apigateway/).

- Vi ønsker å sette opp integrasjonen med `Lambda Proxy Integration`
- For at API-gatewayen skal fungere med frontenden vår og CloudFront er det viktig at pathen til ressursen i APIet er `/api` , på samme måte som i del 1

### Deploy gateway
Kjør `sls deploy` igjen, og sjekk i webkonsollet at API-gatewayen har blitt opprettet korrekt. Endepunktet som skrives ut i terminalen etter `sls deploy` vil ikke fungere før du setter opp tilganger i neste punkt.

## Tilganger

For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under seksjonen *Permissions* i dokumentasjonen til  [Functions](https://serverless.com/framework/docs/providers/aws/guide/functions) for hvordan dette gjøres.

## Deploy hele servicen
Da har vi definert alle delene av applikasjonen vår bortsett fra S3 og CloudFront. Dette gjør vi manuelt gjennom AWS Console etterpå.

- Kjør `sls deploy` igjen for å deploye hele services din
- Verifiser at de ulike ressursene (DynamoDB, API Gateway og Lambda) har blitt opprettet korrekt

## Test
Serverless Framework kommer med en del muligheter for å teste tjenesten din, samt hente ut ulike metrikker og lese logger.
For en fullstendig oversikt over kommandoene som Serverless Framework tilbyr, se [her](https://serverless.com/framework/docs/providers/aws/cli-reference/).

Test ut følgende kommandoer (og gjerne flere) mot tjenesten du nettopp har deployet:

- `sls info` skriver ut informasjon om tjenesten du har deployet, inkludert URL-en til APIet ditt.
- `sls invoke -f <navn-på-lambda>` vil eksekvere en spesifikk lambdafunksjon direkte (utenom API Gateway).
- `sls logs -f <navn-på-lambda>` printer loggene til en gitt lambdafunksjon. Dette er nyttig ved f.eks. feilsøking.
- `sls metrics` gir grunnleggende metrikker om tjenesten din
- `sls metrics -f <navn-på-lambda>` gir metrikker om en spesifikk lambda

### Test APIet
Før vi setter opp frontenden til å peke mot det nye APIet vårt, kan vi også teste at APIet fungerer ved hjelp av `curl`.

Test ut følgende kommandoer for å legge inn og hente ut _todos_. Test gjerne kommandoene vi kjørte ovenfor og hent ut logger og metrikker for lambdafunksjonene etter du har kalt APIet.

- `curl GET <url-til-api>` vil hente ut alle todoene fra DynamoDB-tabellen
- `curl -X POST -H "Content-Type: application/json" -d '{"key":"key1","text":"test"}' <url-til-api>` vil legge inn en ny todo. Merk at `key` må være unik.

## Frontend og CloudFront
Frontenden vår går fortsatt til det gamle API-et vårt. Nå skal vi gå inn i CloudFront og endre routingen slik at `/api` peker til vår nyopprettede API Gateway istedenfor den gamle.

- Opprett en ny *origin* for API-et vi har deployet med Servlerless Framework. Dette gjøres på samme måte som i [del 1](Del1.md#backend)
- Endre *behaviour* slik at trafikk på `/api` blir routet til den nye *origin*, og dermed til vårt nye API

Når du nå tester frontenden skal CloudFront route forespørslene til den nye API-gatewayen, og hente data fra en ny DynamoDB-tabell. Test at dette virker ved at du fortsatt får lagt inn og slettet elementer.

## Rydde opp

Før du går for dagen må du fjerne alle komponentene vi har satt opp.

- `sls remove` fjerner alle ressursene som har blitt satt opp med Serverless Framework

## Bonusoppgaver

Ferdig med alle oppgavene? Da har vi noen bonusoppgaver som du kan bryne deg på til slutt.

### Sette opp et nytt miljø

Serverless Framework kan brukes til å deploye servicen vår til et helt nytt miljø ved å bruke `stage`-konseptet til SF. Default stage er `dev`, men vi ønsker nå å deploye servicen vår til et annet miljø, f.eks. `prod`.


- Først må navnet til DynamoDB-tabellen ta hensyn til `stage` slik at vi unngår navnekonflikter når vi deployer et nytt miljø
- I `serverless.yml` erstatt navnet til DynamoDB-tabellen med `${opt:stage, self:provider.stage}-<tabellnavn>`. Dette gjør at man bruker default stage (dev) fra konfigurasjonen, med mulig overstyring fra kommandolinjen
- Når tabellen har blitt prefixet med miljø, må lambdakoden også ta hensyn til dette. Legg til følgende kode i lambdafunksjonen for å ta hensyn til miljø: 
  ```
  event.requestContext.stage + "-" + TABLE_NAME;
  ```
- `sls deploy --stage <miljo>` vil deploye hele servicen til et nytt miljø. Kjør kommandoen og verifiser at du har fått opprettet nye tjenester med prefix `<miljo>-`

### Lokal kjøring av lambdafunksjoner

Serverless Framework har støtte for å kjøre lambdafunksjonene lokalt ved å emulere kjøretidsmiljøet til AWS Lambda. Dette er dokumentert [her](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/).

- Lag en ny lambdafunksjon som f.eks. printer noe til konsollet, og test at du får kjørt denne lokalt
- Test at du kan sende inn data til funksjonen og print datene du får sendt inn til konsollet
- Legg til den nye lambdafunksjonen din i `serverless.yml`, deploy servicen din på nytt og verifiser at du nå får eksekvert lambdafunksjonen din i AWS

### Versjonering av lambdafunksjoner

Lambdafunksjoner har støtte for såkalte versjoner og aliaser som gjør det mulig å ha ulike versjoner av samme lambdafunksjon. Dette er dokumentert [her](http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html). Du kan også lese mer om det [her](https://aws.amazon.com/blogs/compute/using-api-gateway-stage-variables-to-manage-lambda-functions/).

API Gateway kan videre peke på ulike aliaser av lambdafunksjoner, noe som gjør det mulig å ha ulike versjoner av lambdafunksjonene i de ulike API Gateway `stagene`.

- Opprett to aliaser av lambdafunksjonen din, en `dev` og en `prod` som peker på to ulike versjoner av lambdafunksjonen din
- Opprett et nytt stage i API Gatewayen `prod`
- Opprett så stagevariabler, en for hvert stage, som har nøkkelen `lambdaAlias` og verdiene `dev` og `prod`.
- Videre må du referere til stagevariablen i integrasjonsoppsettet: Under _Integration Type_ -> _Lambda Function_, legg til en referanse til stagevariablen slik `MinLambda:${stageVariables.lambdaAlias}`
- Etter at API Gateway stagene dine peker på ulike aliaser, prøv å oppdatere lambdafunksjonene dine med ny kode (f.eks. printing til konsollet), først i `dev` og så i `prod`
