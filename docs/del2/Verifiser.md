# Deploy og verifiser
Da har vi definert alle delene av services vår.

- Kjør `sls deploy` igjen for å deploye hele services din
- Verifiser at de ulike ressursene (DynamoDB, API Gateway og Lambda) har blitt opprettet korrekt

## Test
Serverless Framework kommer med en del muligheter for å teste tjenesten din, samt hente ut ulike metrikker og lese logger.
For en fullstendig oversikt over kommandoene som Serverless Framework tilbyr, se [her](https://serverless.com/framework/docs/providers/aws/cli-reference/).

Test ut følgende kommandoer (og gjerne flere) mot tjenesten du nettopp har deployet:

- `sls info` skriver ut informasjon om tjenesten du har deployet, inkludert URL-en til APIet ditt.
- `sls invoke -f <navn-på-lambda>` vil eksekvere en spesifikk lambdafunksjon direkte (utenom API Gateway).
- `sls logs -f <navn-på-lambda>` printer loggene til en gitt lambdafunksjon. Dette er nyttig ved f.eks. feilsøking.
- `sls metrics` gir grunnleggende metrikker om tjenesten din
- `sls metrics -f <navn-på-lambda>` gir metrikker om en spesifikk lambda

### Test APIet
Før vi setter opp frontenden til å peke mot det nye APIet vårt, kan vi også teste at APIet fungerer ved hjelp av `curl`.

Test ut følgende kommandoer for å legge inn og hente ut _todos_. Test gjerne kommandoene vi kjørte ovenfor og hent ut logger og metrikker for lambdafunksjonene etter du har kalt APIet.

- `curl GET <url-til-api>` vil hente ut alle todoene fra DynamoDB-tabellen
- `curl -X POST -H "Content-Type: application/json" -d '{"key":"key1","text":"test"}' <url-til-api>` vil legge inn en ny todo. Merk at `key` må være unik.