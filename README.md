# Sett opp en fullstack serverless app i AWS

Vi setter opp tjenestene i samme rekkefølge som de ble gjennomgått på slidene:

# Del 1

1. [DynamoDB](#dynamodb)
2. [Lambda](#lambda)
3. [API Gateway](#api-gateway)
4. [S3](#s3)
5. [Cloudfront](#cloudfront)

## DynamoDB
Lag en ny tabell i DynamoDB

- Lag _Primary key_ med navnet`key`, type string
- Lag _Sort key_ med navnet `text`, type string
- Bruk ellers default settings
- Notér deg navnet på tabellen

## Lambda
Lag en ny Lambda-funksjon. Start med templaten _Blank Function_

- Ikke sett opp noen triggere, dette gjør vi senere
- Gi Lambdaen din et navn
- Velg runtime _Node.js 4.3_ (default)
- Lim inn koden fra [`lambda/index.js`](lambda/index.js). Erstatt variabelen `dynamo_tablename` med navnet på DynamoDB-tabellen.
- Under _Role_, velg _Create new role from templates_
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- La resten stå som default, klikk _Next_ og _Create function_
- Test Lambdaen din ved å trykke på _Test_. Du skal forvente output som begynner med _"Ukjent HTTP-metode ..."_

Lambdaen din er nå opprettet. Vi fortsetter med å sette opp API og frontend.

## API Gateway

### Opprett API med ressurs som trigger lambda
- Opprett et nytt API i API Gateway
- Velg _Acton_ -> _Create Resource_ med path `/api`
- Marker den nyopprettede ressursen og opprett en ny metode på denne med _Action_ -> _Create method_
- Velg `ANY` i dropdownen for å lage en handler for alle HTTP-metoder
- Velg Integration type _Lambda Function_
- Huk av for _Use Lambda Proxy integration_
- Velg regionen der Lambdaen ligger og skriv inn navnet på lambdaen

### Deploy og test API-et
- Velg _Actions_ -> _Deploy API_
- Lag et nytt deployment stage, bruk gjerne navnet `prod`
- Test API-et. Du bør få følgende output:

```
{
  "Items": [],
  "Count": 0,
  "ScannedCount": 0
}
```

Vi skal nå deploye en frontend som benytter seg av API-et vårt.

## S3
- Opprett en S3-bucket
- Last opp [`index.html`](frontend/index.html) og hele [`static/`](frontend/static)-katalogen

Til slutt lager vi en Cloudfront-distribusjon som ligger foran S3-bucketen og API-et vårt

## Cloudfront

### Frontend
Gå inn i Cloudfront-konsollet og opprett en ny distribusjon

- Velg _Web_
- _Origin Domain Name_: Velg din bucket
- La _Origin Path_ være blank
- Velg _Restrict bucket access_ og _Create a New Identity_. Huk av for _Yes, Update Bucket Policy_
- Velg _Redirect HTTP to HTTPS_
- Sett _Default Root Object_ til `index.html`
- La resten stå som default og klikk _Create Distribution_

Du har nå laget en Cloudfront-distribution med en origin for S3-bucketen. Det ble opprettet en default _behavior_ som vil returnere `index.html` fra S3-bucketen din når man går på rot på URL-en til distribusjonen

### Backend
Nå må vi lage en ny origin for API-et, med tilhørende behavior.

1. Under _Origins_, velg _Create Origin_
2. Lim inn URL-en til API-et ditt. Den vil automatisk splittes slik at API-ets deployment stage (f.eks. `/prod`) legges inn i _Origin Path_
3. Velg _HTTPS Only_ og klikk _Create_

Vi må nå lage en _behavior_ som ruter trafikk på visse ruter videre til API-et.

1. Lag en ny behavior
2. Skriv `/api`i _Path Pattern_
3. Velg origin til API-et under _Origin_
4. _Redirect HTTP to HTTPS_
5. Velg _Allowed HTTP Methods_ `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
6. Under _Object caching_, velg _Customize_ og sett både Maximum og Default TTL til `0` for å disable caching
7. La resten stå som default og klikk _Create_

Vi skrur altså av all caching på backenden. I et reellt scenario vil man tune caching-parametrene for de ulike tjenestene man legger bak Cloudfront.

Nå tar det en god stund før distribusjonen er ferdig satt opp. Ta deg en kaffe i mellomtiden.

Det var det! Todo-appen bør fungere nå 🚀

### Sjekke logger? 🕵

Lambdaen logger requester og annet snacks til Cloudwatch. Gå inn og ta en titt om du er nysgjerrig.

# Del 2

I del 2 av workshopen skal vi benytte Serverless Framework til å deploye store deler av applikasjonen vår.
Serverless Framework er dokumentert [her](https://serverless.com/framework/docs/).

#### Installer Serverless Framework
1. Installer serverless ved å kjøre `npm install -g serverless`
2. Når installasjonen er ferdig kan du verifisere at Serverless Framework er installert ved å kjøre kommandoen `serverless` eller `sls` (`sls` er en snarvei for `serverless`)

#### Sett opp AWS Credentials

For å gi Serverless Framework mulighet til å opprette ressurser i AWS, må vi sette opp AWS credentials som vi setter som miljøvariabler i terminalen.

1. I AWS Console, klikk på brukernavnet ditt øverst til høyre og velg *Security Credentials*
2. Hvis det kommer opp en dialog som sier *You are accessing the security credentials (...)* velg *Continue to Security Credentials*
2. Velg *Access Keys* og trykk på knappen *Create New Access Key*
3. Last ned nøklene og eksporter disse som miljøvariabler i terminalen ved å kjøre følgende kommandoer:
	
	```
	export AWS_ACCESS_KEY_ID=<your-key-here>
	export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
	```

Hvis du støter på problemer, kan du se på dokumentasjon til hvordan man setter opp AWS Credentials med Serverless Framework [her](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

### Service
Vi skal først sette opp en service. Dette kan du i vårt tilfelle tenke på som applikasjonen vår. Du kan lese mer om servicer [her](https://serverless.com/framework/docs/providers/aws/guide/services/).

1. Opprett en ny, tom mappe, på maskinen din og kjør følgende kommando for å lage en service: `sls create --template aws-nodejs --path <selvsagt-service-navn>`
2. Du har nå fått opprettet en template til en service, og all konfigurasjon til servicen ligger i filen `serverless.yml`
2. Åpne `serverless.yml`, fjern kommentaren for region og endre til ønsket region, for eksempel `eu-central-1`

### DynamoDB
Vi skal, som i del 1, starte med å sette opp en DynamoDB-tabell. Dette gjøres ved å definere en såkalt CloudFormation-template i `serverless.yml`. Du kan lese mer om dette [her](https://serverless.com/framework/docs/providers/aws/guide/resources/).

1. Sett opp en DynamoDB-tabell under `resources` i `serverless.yml`. Tabellen skal være helt lik den vi lagde i del 1
	- Tabellnavn i DynamoDB er unike, bruk derfor et annet navn enn i del 1
	- Attributtene til tabellene defineres i `AttributeDefinitions`
  - `PrimaryKey` og `SortKey` defineres i `KeySchema`
  - Du kan lese mer om oppsett av DynamoDB-tabeller med CloudFormation [her](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html)

#### Deploy
Utfør kommandoen `sls deploy` for å deploye tjenesten med det som er definert av ressurser hittil. Verifiser at DynamoDB-tabellen din har blitt opprettet korrekt.

### Funksjoner
Vi skal nå ta for oss lambdafunksjonen vi lagde i del 1, og deploye denne med serverless-rammeverket i stedet. Du kan lese mer om funksjoner [her](https://serverless.com/framework/docs/providers/aws/guide/functions/).

1. Erstatt innholdet i filen `handler.js` med innholdet i fila `lamda/index,js`, som vi brukte til lambdafunksjonen i del 1. Merk at `exports.handler` må byttes ut med `module.exports.<navn-på-lambda>`. Du velger selv hva lambdafunksjonen din skal hete.
2. Erstatt tabellnavnet i lambda-koden med navnet på tabellen du definerte i forrige steg
3. Finn konfigurasjonsdelen for funksjoner i `serverless.yml` og erstatt `hello` med navnet på lambdafunksjonen din

#### Deploy
Kjør `sls deploy` igjen, og verifiser at lambdafunksjonen har blitt opprettet korrekt.

### Events

Som i del 1 skal vi trigge lambdaen via API Gateway. Les om hvordan dette gjøres [her](https://serverless.com/framework/docs/providers/aws/events/apigateway/).

1. Vi ønsker å sette opp integrasjonen med `Lambda Proxy Integration`
2. For at API-gatewayen skal fungere med Frontenden vår og CloudFront er det viktig at pathen til ressursen i APIet er `/api` , på samme måte som i del 1.

#### Deploy
Kjør `sls deploy` igjen, og verifiser at API-gatewayen har blitt opprettet korrekt.

### Tilganger

For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under seksjonen *Permissions* i dokumentasjonen til  [Functions](https://serverless.com/framework/docs/providers/aws/guide/functions) for hvordan dette gjøres.

### Deploy
Da har vi definert alle delene av applikasjonen vår bortsett fra S3 og CloudFront. Dette gjør vi manuelt gjennom AWS Console etterpå.

1. Kjør `sls deploy` igjen for å deploye hele services din
2. Verifiser at de ulike ressursene (DynamoDB, API Gateway og Lambda) har blitt opprettet korrekt

### Test
Serverless Framework kommer med en del muligheter for å teste tjenesten din, samt hente ut ulike metrikker og lese logger. 
For en fullstendig oversikt over kommandoene som Serverless Framework tilbyr se [her](https://serverless.com/framework/docs/providers/aws/cli-reference/).

Test ut følgende kommandoer (og gjerne flere) mot tjenesten du nettopp har deployet:

1. `sls info` skriver ut informasjon om tjenesten du har deployet, inkludert URL-en til APIet ditt.
2. `sls invoke -f <navn-på-lambda>` vil eksekvere en spesifikk lambdafunksjon direkte (utenom API Gateway).
3. `sls logs -f <navn-på-lambda>` printer loggene til en gitt lambdafunksjon. Dette er nyttig ved f.eks. feilsøking.
4. `sls metrics` gir grunnleggende metrikker om tjenesten din
5. `sls metrics -f <navn-på-lambda>` gir metrikker om en spesifikk lambda

### Frontend og CloudFront
Frontenden vår går fortsatt til det gamle API-et vårt. Nå skal vi gå inn i CloudFront og endre routingen slik at `/api` peker til vår nyopprettede API-Gateway istedenfor den gamle.

1. Opprett en ny *origin* for API-et vi har deployet med Servlerless Framework. Dette gjøres på samme måte som for del 1
2. Endre *behaviour* slik at trafikk på `/api` blir routet til den nye *origin*, og dermed til vårt nye API-et

Når du nå tester frontenden skal CloudFront route forespørslene til den nye API-gatewayen, og hente data fra en ny DynamoDB-tabell. Test at dette virker ved at TODO-listen nå er tom, og at du fortsatt får lagt inn og slettet elementer.

## Rydde opp

Før du går for dagen bør du fjerne alle komponentene som vi har satt opp.

1. `sls remove` fjerner alle ressursene som har blitt satt opp med Serverless Framework

#### Trekke miljøvariabler ut i eventet
Man kan forbedre funksjonen ved at man konfigurerer API Gateway til å sende med origin_url istedet for at det er hardkodet i funksjonen.
Om du ønsker å gjøre det med terraform kan du bruke ressursen  [api_gateway_deployment](https://www.terraform.io/docs/providers/aws/r/api_gateway_deployment.html).
Det kan også gjøres manuelt i stage-en i API Gateway igjennom AWS konsollet.

#### Forbedre Terraform oppsett
1. Legge til CORS støtte med terraform
2. Fikse integrasjonsproxyen med lambda. OBS: Dette kan være en bug i terraform
