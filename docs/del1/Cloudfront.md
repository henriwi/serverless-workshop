# Cloudfront

Siste steg er å sette opp en Cloudfront-distribusjon som ligger foran både front- og backend. Formålet med Cloudfront er å samle front- og backend bak samme origin (domene), blant annet for å unngå problematikk knyttet til [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Oppsummering av oppsettet

Vår oppsett i Cloudfront består av flere deler.

### Distribusjon
_Distribusjoner_ er det øverste konseptet i Cloudfront. På en distribusjon setter man opp regler, kalt _behaviors_, for å rute trafikk på ulike URL-er videre til separate mål, kalt  _origins_. På denne måten kan man samle flere webtjenester under samme domene.

Hver distribusjon i Cloudfront får sin egen URL, på formatet `https://<din-cloudfront-id>.cloundfront.net`. Man kan også sette opp egne domener og sertifikater om man ønsker.

### Frontend

Vi skal lage en origin for frontenden som peker videre til S3-bucketen vår. Vi får automatisk en default behavior som ruter all trafikk på rot-ressursen videre til S3. Det betyr at når noen går direkte til Cloudfront-domenet ditt, `http://<din-cloudfront-id>.cloudfront.net/`, vil frontenden lastes.

### Backend

Backenden får også sin egen origin, og vi skal sette opp en behavior som ruter all trafikk på `/todos` videre til denne originen.

## Origin og behavior for frontend
Gå inn i Cloudfront-konsollet og opprett en ny distribusjon

- Velg _Web_
- _Origin Domain Name_: Velg originet i nedtrekkslista som svarer til din S3-bucket
- La _Origin Path_ være blank
- Under _Restrict bucket access_ velg _Yes_
- Under _Grant Read Permissions on Bucket_ velg _Yes_
- Velg _Redirect HTTP to HTTPS_
- Under _Price Class_, velg _Use Only U.S., Canada and Europe_
- Sett _Default Root Object_ til `index.html`
- Skriv navnet ditt i _Comment_-feltet, så blir det lettere å finne igjen distribusjonen i menyen etterpå
- La resten stå som default og klikk _Create Distribution_

Du har nå laget en Cloudfront-distribution med en origin for S3-bucketen. Det ble opprettet en default _behavior_ som vil returnere `index.html` fra S3-bucketen din når man går på rot på URL-en til distribusjonen.

## Origin for backend

Neste steg er å lage en origin for API-et.

- Gå inn i administrasjonspanelet for distribusjonen du opprettet i forrige steg
- Under _Origins_, velg _Create Origin_
- Lim inn URL-en til API-et ditt i _Origin Domain Name_. Den vil automatisk splittes slik at API-ets deployment stage (f.eks. `/prod`) legges inn i _Origin Path_. Merk at du ikke skal ha med `/todos`-delen på URL-en du limer inn her
- Velg _HTTPS Only_ og klikk _Create_

## Behavior for backend

Til slutt lager vi en behavior som ruter trafikk på visse ruter videre til API-et.

- Lag en ny behavior
- Skriv `/todos`i _Path Pattern_
- Velg origin til API-et under _Origin_
- _Redirect HTTP to HTTPS_
- Velg _Allowed HTTP Methods_ `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
- Under _Object caching_, velg _Customize_ og sett både _Maximum TT_ og _Default TTL_ til `0` for å disable caching
- La resten stå som default og klikk _Create_

Vi skrur altså av all caching på backenden. I et reellt scenario vil man justere caching-parametrene for de ulike tjenestene man legger bak Cloudfront.

Det tar rundt 10 minutter for AWS å provisjonere opp Cloudfront-distribusjonen din. Ta deg en kaffe i mellomtiden.

Det var det! Hvis du nå går tilbake til dashboardet for Cloudfront og åpner URLen som ligger i `Domain Name`-kolonnen skal Todo-appen fungere 🚀

Da er vi ferdige med del 1. Vi tar en oppsummering i plenum når alle er ferdige. I mellomtiden kan du gjerne sniktitte på del 2.
