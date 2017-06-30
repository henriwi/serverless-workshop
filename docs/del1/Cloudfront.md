# Cloudfront

Siste steg er å sette opp en Cloudfront-distribusjon som ligger foran både front- og backend. Formålet med Cloudfront er å samle front- og backend bak samme origin (domene), blant annet for å unngå problematikk knyttet til [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

Konfigurasjonen av Cloudfront består av flere steg:

- Opprette en _distribusjon_ som samler all konfigurasjonen
- Opprette et _origin_ for frontend
- Opprette et _origin_ for backend
- Opprette en _behavior_ for backenden som ruter trafikken riktig videre til API-et vårt

## Frontend
Gå inn i Cloudfront-konsollet og opprett en ny distribusjon

- Velg _Web_
- _Origin Domain Name_: Velg originet i nedtrekkslista som svarer til din S3-bucket
- La _Origin Path_ være blank
- Velg _Restrict bucket access_ og _Create a New Identity_. Velg _Yes, Update Bucket Policy_
- Velg _Redirect HTTP to HTTPS_
- Sett _Default Root Object_ til `index.html`
- La resten stå som default og klikk _Create Distribution_

Du har nå laget en Cloudfront-distribution med en origin for S3-bucketen. Det ble opprettet en default _behavior_ som vil returnere `index.html` fra S3-bucketen din når man går på rot på URL-en til distribusjonen

## Backend
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


