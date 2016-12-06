## Sett opp en fullstack serverless app i AWS

### DynamoDB
- Lag en ny tabell i DynamoDB
  - Lag _Primary key_ med navnet`key`, type string
  - Lag _Sort key_ med navnet `text`, type string
  - Bruk ellers default settings
  - Notér deg navnet på tabellen

### Lambda
- Lag en ny Lambda-funksjon. Start med templaten _Blank Function_
- Ikke sett opp noen triggere, dette gjør vi senere
- Gi Lambdaen din et navn
- Velg runtime _Node.js 4.3_ (default)
- Lim inn koden fra `lambda/index.js`. Erstatt variabelen `dynamo_tablename` med navnet på DynamoDB-tabellen din i alle eventhandlerene. Variabelen `frontend_origin` ignorerer du inntil videre.
- Under _Role_, velg _Create new role from templates_
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- La resten stå som default, klikk _Next_ og _Create function_
- Test Lambdaen din ved å trykke på _Test_. Du skal forvente output ala _"Ukjent HTTP-metode ..."_

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
- Test API-et. Du bør få følgende output

```
{
  "Items": [],
  "Count": 0,
  "ScannedCount": 0
}
```

Vi skal nå deploye en frontend som benytter seg av API-et vårt.

### Legg inn API-URL i frontenden
Først må vi legge inn riktig URL til API-et i frontenden.
- Rediger API-root i `actions.js` i repoet
- Kjør `npm install`
- Kjør `npm run build` for å bygge applikasjonen

### S3
#### REDIGERE ACTIONS.JS HER? laste opp til static-mappe? permissions på alt
- Opprett en S3-bucket
- Last opp `index.html`
- Lag en mappe kalt `static` og last opp `bundle.js` og `styles.css` i denne
- Sett leserettigheter for _Everyone_ på alle tre filene 
- Gå på properties på bucketen din og sett opp _Static website hosting_ med `index.html` som _index document_
- Noter deg domenenavnet siten din får: `<ditt-bucketnavn>.s3-website.<aws-region>.amazonaws.com`

### Konfigurer CORS
For at frontenden skal fungere mot API-et må vi configurere [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS):

#### I API-et
- Gå tilbake til API-et ditt
- Velg _Actions_ -> _Enable CORS_
- Lim inn domenenavnet til frontenden din i `Access-Control-Allow-Origin`-headeren. Sjekk at du ikke får med trailing slash, med mindre siten din har trailing slash. 
- Fullfør CORS-wizarden
- Deploy API-et ditt på nytt

#### I Lambdaen
- Gå til lambdaen din
- Finn headerne som returneres fra lambdaen og legg inn URL-en til frontenden din i CORS-headeren her også. Pass på å ikke ta med trailing slash her heller

Det var det! Todo-appen bør fungere nå 🚀

### Sjekke logger? 🕵

Lambdaen logger requester og annet snacks til Cloudwatch. Gå inn og ta en titt om du er nysgjerrig på sånt.
