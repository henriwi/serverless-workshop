# Del 1 – manuelt oppsett av fullstack serverless applikasjon i AWS web console

Vi setter opp tjenestene i samme rekkefølge som de ble gjennomgått på slidene:

1. [DynamoDB](#dynamodb)
2. [Lambda](#lambda)
3. [API Gateway](#api-gateway)
4. [S3](#s3)
5. [Cloudfront](#cloudfront)

## DynamoDB
Vi starter med å opprette DynamoDB-tabellen som skal holde på todoene i applikasjonen vår. Finn frem til DynamoDB i AWS-konsollet, og klikk _"Create table"_ for å lage en ny tabell.

- Gi tabellen et valgfritt navn
- Lag _Primary (partition) key_ med navnet`key`, type string
- Lag _Sort key_ med navnet `text`, type string
- Bruk ellers default settings
- Notér deg navnet på tabellen

## Lambda
Neste steg er å lage Lambdafunksjonen som skal fungere som backenden i appen vår. Her ligger logikken for å hente, lagre og slette todos.

Finn frem til Lambda i AWS-konsollet og klikk _"Get started now"_ eller _"Create new lambda"_.

- Start med templaten _Blank Function_
- Ikke sett opp noen triggere, dette gjør vi senere
- Gi Lambdaen din et valgfritt navn
- Velg runtime _Node.js 6.10_ (default)
- Koden i tekstboksen erstattes med koden fra [`lambda/index.js`](lambda/index.js). Variabelen `TABLE` erstattes med navnet på DynamoDB-tabellen din.
- Under _Role_, la _Create new role from templates_ stå
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- La resten stå som default, klikk _Next_ og _Create function_
- Test Lambdaen din ved å trykke på _Test_. Lambdaen skal svare med en variant av "Hello World!".

Nå er i prinsippet backenden for applikasjonen klar: Vi har en Lambda som holder på logikken vår og bruker DynamoDB til lagring. Imidlertid kan ikke invokere backenden over HTTP uten å ha en API Gateway. Denne lager vi i neste steg.

## API Gateway

For å lage API-et må vi gjøre tre ting:

- Opprette en REST-_ressurs_
- Opprette en _action_ som håndterer innkommende requests på ressursen, og knytte denne mot Lambdaen vår
- _Deploye_ APIet


### Opprett API med ressurs som trigger lambdafunksjonen
- Finn frem til API Gateway i AWS-konsollet
- Opprett et nytt API med et valgfritt navn
- I menyen, velg _Actions_ -> _Create Resource_ og bruk path `/todos`. Gi ressursen et valgfritt navn og klikk _Create resource_
- Marker den nyopprettede ressursen og opprett en ny metode på denne med _Actions_ -> _Create method_
- Velg `ANY` i dropdownen for å lage en handler for alle HTTP-metoder
- Velg Integration type _Lambda Function_
- Velg _Use Lambda Proxy integration_
- Velg regionen der Lambdaen ligger og skriv inn navnet på lambdaen

### Deploy og test API-et
- Velg _Actions_ -> _Deploy API_
- Lag et nytt deployment stage, bruk gjerne navnet `prod`
- Test API-et ved å klikke på _Invoke URL_. Legg på `/todos` på slutten, slik at du får en URL på formatet `https://<id>.execute-api.<region>.amazonaws.com/prod/todos`. Får du følgende output?

```
{
  "Items": [],
  "Count": 0,
  "ScannedCount": 0
}
```

Bra! Da er API-et korrekt konfigurert, og backenden er komplett 🚀

Vi skal nå deploye en frontend som bruker API-et vårt.

## S3
Vi har allerede opprettet S3-buckets til dere. Disse har navnene `jz-bucket-1`, `jz-bucket-2`, osv.
- Finn S3-bucketen med samme nummer som brukeren din.
- Last opp [`index.html`](frontend/index.html) og hele [`static/`](frontend/static)-katalogen

That's it! Siste steg er å lage en Cloudfront-distribusjon som ligger foran frontenden (S3) og backenden (API Gateway, Lambda, DynamoDB).

## Cloudfront

Konfigurasjonen av Cloudfront består av flere steg:

- Opprette en _distribusjon_ som samler all konfigurasjonen
- Opprette et _origin_ for frontend
- Opprette et _origin_ for backend
- Opprette en _behavior_ for backenden som ruter trafikken riktig videre til API-et vårt

### Frontend
Gå inn i Cloudfront-konsollet og opprett en ny distribusjon

- Velg _Web_
- _Origin Domain Name_: Velg originet i nedtrekkslista som svarer til din S3-bucket
- La _Origin Path_ være blank
- Velg _Restrict bucket access_ og _Create a New Identity_. Velg _Yes, Update Bucket Policy_
- Velg _Redirect HTTP to HTTPS_
- Sett _Default Root Object_ til `index.html`
- La resten stå som default og klikk _Create Distribution_

Du har nå laget en Cloudfront-distribution med en origin for S3-bucketen. Det ble opprettet en default _behavior_ som vil returnere `index.html` fra S3-bucketen din når man går på rot på URL-en til distribusjonen

### Backend
Nå må vi lage en ny origin for API-et, med tilhørende behavior.

- Gå inn i administrasjonspanelet for distribusjonen du opprettet i forrige steg
- Under _Origins_, velg _Create Origin_
- Lim inn URL-en til API-et ditt i _Origin Domain Name_. Den vil automatisk splittes slik at API-ets deployment stage (f.eks. `/prod`) legges inn i _Origin Path_. Merk at du ikke skal ha med `/todos`-delen på URL-en du limer inn her.
- Velg _HTTPS Only_ og klikk _Create_

Vi må nå lage en _behavior_ som ruter trafikk på visse ruter videre til API-et.

- Lag en ny behavior
- Skriv `/todos`i _Path Pattern_
- Velg origin til API-et under _Origin_
- _Redirect HTTP to HTTPS_
- Velg _Allowed HTTP Methods_ `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
- Under _Object caching_, velg _Customize_ og sett både Maximum og Default TTL til `0` for å disable caching
- La resten stå som default og klikk _Create_

Vi skrur altså av all caching på backenden. I et reellt scenario vil man tune caching-parametrene for de ulike tjenestene man legger bak Cloudfront.

Nå tar det en god stund før distribusjonen er ferdig satt opp. Ta deg en kaffe i mellomtiden.

Det var det! Hvis du når går til URLen som ligger i `Domain Name`-kolonnen skal Todo-appen fungere 🚀

## Sjekke logger? 🕵

Lambdaen logger requester og annet snacks til Cloudwatch. Gå inn og ta en titt om du er nysgjerrig.

## Del 2

Vi tar en oppsummering i plenum etter disse oppgavene, men er du ferdig allerede kan du gå videre på [del 2](Del2.md).
