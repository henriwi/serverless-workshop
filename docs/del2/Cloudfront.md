# Frontend og CloudFront

Frontenden vår går fortsatt mot det gamle API-et vårt. Nå skal vi gå inn i CloudFront og endre routingen slik at `/todos` peker til vår nyopprettede API Gateway istedenfor den gamle.


- Opprett en ny *origin* for API-et vi har deployet med Servlerless Framework. Dette gjøres på samme måte som i del 1:
	- Gå inn i administrasjonspanelet for distribusjonen du opprettet i forrige steg
	- Under _Origins_, velg _Create Origin_
	- Lim inn URL-en til API-et ditt i _Origin Domain Name_. Den vil automatisk splittes slik at API-ets deployment stage (f.eks. `/prod`) legges inn i _Origin Path_. Merk at du ikke skal ha med `/todos`-delen på URL-en du limer inn her.
	- Velg _HTTPS Only_ og klikk _Create_

- Endre *behaviour* slik at trafikk på `/todos` blir routet til den nye *origin*, og dermed til vårt nye API

Når du nå tester frontenden skal CloudFront route forespørslene til den nye API-gatewayen, og hente data fra en ny DynamoDB-tabell. Test at dette virker ved at du fortsatt får lagt inn og slettet elementer.

## Rydde opp

Før du går for dagen må du fjerne alle komponentene vi har satt opp.

- `sls remove` fjerner alle ressursene som har blitt satt opp med Serverless Framework