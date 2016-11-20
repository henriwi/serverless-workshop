## Sett opp en fullstack serverless app i AWS

### DynamoDB
- Lag en ny tabell i DynamoDB
  - Primary key: `key`, string
  - Sort key: `text`, string
  - Notér deg navnet på tabellen

### Lambda
- Lag en ny Lambda-funksjon. Start med templaten _Blank Function_
- Ikke sett opp noen triggere, dette gjør vi senere
- Gi Lambdaen din et navn
- Velg runtime _Node.js 4.3_ (default)
- Lim inn koden fra `src/lambda.js`. Erstatt `"todos"` med navnet på DynamoDB-tabellen din i alle eventhandlerene
- Under _Role_, velg _Create new role from templates_
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- Test Lambdaen din ved å trykke på _Test_ Du skal forvente output ala _"Ukjent HTTP-metode ..."_

Lambdaen din er nå opprettet. Vi fortsetter med å sette opp API og frontend.

### API Gateway

#### Opprett API med ressurs som trigger lambda
- Opprett et nytt API i API Gateway
- Velg _Action_ -> _Create method_ for å opprette en metode på rot-ressursen (`/`)
- Velg `ANY` i dropdownen for å lage en handler for alle HTTP-metoder
- Velg Integration type _Lambda Function_
- Hak av for _Use Lambda Proxy integration_
- Velg regionen der Lambdaen fra forrige steg ligger, og skriv inn navnet på lambdaen.

#### Deploy og test API-et
- Velg _Actions_ -> _Deploy API_
- Lag et nytt deployment stage
- Test API-et og se at det svarer

Vi skal nå deploye en frontend som benytter seg av API-et vårt

### S3
- Opprett en S3-bucket
- Last opp `index.html`
    - Sett leserettigheter for _Everyone_ på fila
    - Sett opp _Website hosting_ på bucketen med `index.html` som _index document_
    - Noter deg domenenavnet siten din får: `<ditt-bucketnavn>.s3-website.<aws-region>.amazonaws.com`

### Konfigurer CORS
For at frontenden skal fungere mot API-et må vi configurere [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS):

#### I API-et
- Gå tilbake til API-et ditt
- Velg _Actions_ -> _Enable CORS_
- Lim inn domenenavnet til frontenden din i `Access-Control-Allow-Origin`-headeren. Sjekk at du ikke får med trailing slash, med mindre siten din har trailing slash. 
- Lagre og deploy API-et ditt på nytt

#### I Lambdaen
- Gå til lambdaen din
- Finn headerne som returneres fra lambdaen og legg inn URL-en til frontenden din i CORS-headeren her også

### Legg inn API-root i frontenden
For at frontenden skal gå mot riktig host må vi legge inn URL-en til API-et
- Gå til `frontend/js/action.js` og erstatt `URL`-konstanten med URL-en til API-et ditt
- Kjør `npm install`
- Kjør `npm run build`
- Last opp `bundle.js` og `styles.css` til S3-bucketen din
- Sett leserettigheter for `Everyone` på fila

### Test appen din
- Sjekk logger i Cloudwatch
