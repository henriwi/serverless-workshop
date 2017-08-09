# Frontend og CloudFront

Frontenden vår går fortsatt mot det gamle API-et vårt. Nå skal vi gå inn i CloudFront og endre routingen slik at `/todos` peker til vår nyopprettede API Gateway istedenfor den gamle.

## Origin for backend

Vi starter med å lage en origin for API-et vi har deployet med Servlerless Framework. Dette gjøres på samme måte som i del 1.

- Gå inn i administrasjonspanelet for distribusjonen du opprettet i forrige steg
- Under _Origins_, velg _Create Origin_
- Lim inn URL-en til API-et ditt i _Origin Domain Name_. Den vil automatisk splittes slik at API-ets deployment stage (f.eks. `/dev`) legges inn i _Origin Path_. Merk at du ikke skal ha med `/todos`-delen på URL-en du limer inn her.
- Velg _HTTPS Only_ og klikk _Create_

## Behavior for backend

Naviger deg til den eksisterende behaviouren som i dag sørger for at trafikk til `/todos` routes til API-et vi laget i del 1. Endre behaviouren slik at trafikk på `/todos` blir routet til den nye *origin* vi nettopp har laget, og dermed til vårt nye API.

Det tar litt tid for AWS å provisjonere opp endringene i Cloudfront-distribusjonen. Ta deg en ☕ til mens du venter.

Når du nå tester frontenden skal CloudFront route forespørslene til den nye API-gatewayen, og hente data fra en ny DynamoDB-tabell. Test at dette virker ved at du fortsatt får lagt inn og slettet elementer.