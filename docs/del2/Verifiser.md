# Verifiser og test
Serverless Framework kommer som sagt tidligere med en del muligheter for å teste tjenesten din, samt hente ut ulike metrikker og lese logger. For en fullstendig oversikt over kommandoene som Serverless Framework tilbyr, se [her](https://serverless.com/framework/docs/providers/aws/cli-reference/).

Test ut følgende kommandoer (og gjerne flere) mot tjenesten du nettopp har deployet:

- `sls info` skriver ut informasjon om tjenesten du har deployet, inkludert URL-en til APIet ditt.
- `sls invoke -f <navn-på-lambda> -d <data>` vil (som vi gjorde tidligere) eksekvere en spesifikk lambdafunksjon direkte og sende med <data> som input itl funksjonen.
- `sls logs -f <navn-på-lambda>` printer loggene til en gitt lambdafunksjon. Dette er nyttig ved f.eks. feilsøking.
- `sls metrics` gir grunnleggende metrikker om tjenesten din
- `sls metrics -f <navn-på-lambda>` gir metrikker om en spesifikk lambda

### Test APIet
Før vi setter opp frontenden til å peke mot det nye API-et vårt, kan vi også teste at API-et fungerer ved hjelp av `curl`.

Test ut følgende kommandoer for å legge inn og hente ut todos. Test gjerne kommandoene vi kjørte ovenfor og hent ut logger og metrikker for lambdafunksjonene etter du har kalt API-et.

- `curl -X GET <url-til-api>` vil hente ut alle todoene fra DynamoDB-tabellen
- `curl -X POST -H "Content-Type: application/json" -d '{"key":"key1","text":"test"}' <url-til-api>` vil legge inn en ny todo. Merk at `key` må være unik.
