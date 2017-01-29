# Sett opp en fullstack serverless app i AWS

Vi setter opp tjenestene i samme rekkefølge som de ble gjennomgått på slidene:

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

### Bonusoppgaver

#### Bruk Serverless Framework til å deploye lambdafunksjonen
Serverless Framework er dokumentert [her](https://serverless.com/framework/docs/).

- Gå til [serverless.com](https://serverless.com/framework/docs/providers/aws/guide/installation/) og installer `serverless`
- Sett opp AWS credentials ved å eksportere `AWS_ACCESS_KEY_ID` og `AWS_SECRET_ACCESS_KEY` i terminalen. Dokumentasjon finner du [her](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

##### Service
- Vi skal først sette opp en service. Dette kan du lese mer om [her](https://serverless.com/framework/docs/providers/aws/guide/services/)
- Kjør følgende kommando for å lage en service: `serverless create --template aws-nodejs --path <service-navn>`
- Åpne `serverless.yml`, fjern kommentaren for region og endre til ønsket region

##### Funksjon
- Nå skal vi ta lambdafunksjonen som vi laget i workshopen og deploye denne med serverless-rammeverket i stedet. Du kan lese mer om funksjoner [her](https://serverless.com/framework/docs/providers/aws/guide/functions/)
- Erstatt innholdet i filen `handler.js` med koden til lambdafunksjonen vi brukte i sted. Erstatt `exports.handler` med `module.exports.<navn-på-lambda>`
- Finn konfigurasjonsdelen for funksjoner i `serverless.yml` og erstatt `hello` med navnet på lambda-funksjonen din

##### Events
- For å kunne kjøre lambdaen skal vi som i workshopen trigge lambdaen fra API Gateway. For å sette opp dette, les hvordan dette gjøres [her](https://serverless.com/framework/docs/providers/aws/events/apigateway/)
- Vi ønsker å sette opp integrasjonen med `Lambda Proxy Integration`
- Husk å aktivere `cors`.

##### Tilganger
- For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under Permissions [her](https://serverless.com/framework/docs/providers/aws/guide/functions/) for hvordan dette gjøres

##### Deploy
- For å deploye hele services din, inkludert funksjoner og API Gateway konfigurasjon, kjør `serverless deploy`
- Kommandoen vil skrive ut URL-en til API-et ditt. Test at denne fungerer og at data fra DynamoDB-tabellen blir returnert
- For å kun deploye endringer i lambda-funksjonen din kan du kjøre `serverless deploy -f <lambda-funksjon>`
- For å kjøre lambdafunksjonen kan du kjøre `serverless invoke -f <lambda-funksjon> -l`

##### Frontend
- Til slutt kan du bytte ut URL-en til det nye API-et ditt i `actions.js` og bygge frontenden på nytt. Husk å laste opp `bundle.js` til S3 på nytt, og sjekk at frontenden fortsatt fungerer

##### Rydde opp
- Fjern alle komponentene som serverless har satt opp ved å kjøre `serverless remove`.

#### Trekke miljøvariabler ut i eventet
Man kan forbedre funksjonen ved at man konfigurerer API Gateway til å send med origin_url istedet for at det er hardkodet i funksjonen.
Om du ønsker å gjøre det med terraform kan du bruke ressursen  [api_gateway_deployment](https://www.terraform.io/docs/providers/aws/r/api_gateway_deployment.html).
Det kan også gjøres manuelt i stage-en i API Gateway igjennom AWS konsollet.

#### Forbedre Terraform oppsett
1. Legge til CORS støtte med terraform
2. Fikse integrasjonsproxyen med lambda. OBS: Dette kan være en bug i terraform
