# Del 1 – manuelt oppsett av fullstack serverless applikasjon i AWS web console

Vi setter opp tjenestene i samme rekkefølge som de ble gjennomgått på slidene:

1. [DynamoDB](#dynamodb)
2. [Lambda](#lambda)
3. [API Gateway](#api-gateway)
4. [S3](#s3)
5. [Cloudfront](#cloudfront)

## DynamoDB
<img src="http://cdn.markomedia.com.au/wp-content/uploads/2015/03/DynamoDB.svg_.png" style="float:left;">
DynamoDB er en "fully managed", skjemaløs NoSQL-database fra Amazon, og blir brukt til å lagre todoene i vår applikasjon.

Finn frem til DynamoDB i AWS-konsollet, og klikk _"Create table"_ for å lage en ny tabell.

- Gi tabellen et valgfritt navn
- Lag _Primary (partition) key_ med navnet`key`, type string
- Lag _Sort key_ med navnet `text`, type string
- Bruk ellers default settings
- Notér deg navnet på tabellen

## Lambda
Lag en ny Lambda-funksjon.

- Start med templaten _Blank Function_
- Ikke sett opp noen triggere, dette gjør vi senere
- Gi Lambdaen din et navn
- Velg runtime _Node.js 6.10_ (default)
- Erstatt koden i tekstboksen med koden fra [`lambda/index.js`](lambda/index.js). Erstatt variabelen `TABLE` med navnet på DynamoDB-tabellen din.
- Under _Role_, la _Create new role from templates_ stå
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- La resten stå som default, klikk _Next_ og _Create function_
- Test Lambdaen din ved å trykke på _Test_. Lambdaen skal svare med en variant av "Hello World!".

Nå er lambdafunksjonen din opprettet. Vi fortsetter med å sette opp API og frontend.

## API Gateway

### Opprett API med ressurs som trigger lambda
- Opprett et nytt API i API Gateway
- Velg _Actions_ -> _Create Resource_ med path `/todos`. Gi ressursen et valgfritt navn og klikk _Create resource_
- Marker den nyopprettede ressursen og opprett en ny metode på denne med _Actions_ -> _Create method_
- Velg `ANY` i dropdownen for å lage en handler for alle HTTP-metoder
- Velg Integration type _Lambda Function_
- Velg _Use Lambda Proxy integration_
- Velg regionen der Lambdaen ligger og skriv inn navnet på lambdaen

### Deploy og test API-et
- Velg _Actions_ -> _Deploy API_
- Lag et nytt deployment stage, bruk gjerne navnet `prod`
- Test API-et ved å klikke på _Invoke URL_. Legg på `/todos` på slutten, slik at du får en URL på formatet `https://<id>.execute-api.<region>.amazonaws.com/prod/todos` Du bør få følgende output:

```
{
  "Items": [],
  "Count": 0,
  "ScannedCount": 0
}
```

Vi skal nå deploye en frontend som benytter seg av API-et vårt.

## S3
Vi har opprettet S3-buckets med navnene `jz-bucket-1`, `jz-bucket-2`, osv.
- Finn S3-bucketen med samme nummer som brukeren din.
- Last opp [`index.html`](frontend/index.html) og hele [`static/`](frontend/static)-katalogen

Til slutt lager vi en Cloudfront-distribusjon som ligger foran S3-bucketen og API-et vårt

## Cloudfront

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
