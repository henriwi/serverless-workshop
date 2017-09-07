# Verifiser og test
Serverless Framework kommer som sagt tidligere med en del muligheter for å teste tjenesten din, samt hente ut ulike metrikker og lese logger. For en fullstendig oversikt over kommandoene som Serverless Framework tilbyr, se [her](https://serverless.com/framework/docs/providers/aws/cli-reference/).

Test ut følgende kommandoer (og gjerne flere) mot tjenesten du nettopp har deployet:

- `sls info` skriver ut informasjon om tjenesten du har deployet, inkludert URL-en til APIet ditt.
- `sls invoke -f <navn-på-function> -d <data>` vil (som vi gjorde tidligere) eksekvere en spesifikk function direkte og sende med <data> som input til funksjonen.
- `sls logs -f <navn-på-function>` printer loggene til en gitt function. Dette er nyttig ved f.eks. feilsøking.
- `sls metrics` gir grunnleggende metrikker om tjenesten din
- `sls metrics -f <navn-på-function>` gir metrikker om en spesifikk function

### Test APIet
Før vi setter opp frontenden til å peke mot det nye API-et vårt, kan vi også teste at API-et fungerer ved hjelp av `curl`.

Test ut følgende kommandoer for å legge inn og hente ut todos. Test gjerne kommandoene vi kjørte ovenfor og hent ut logger og metrikker for lambdafunksjonene etter du har kalt API-et.

- `curl -X GET <url-til-api>` vil hente ut alle todoene fra DynamoDB-tabellen
- `curl -X POST -H "Content-Type: application/json" -d '{"key":"key1","text":"test"}' <url-til-api>` vil legge inn en ny todo. Merk at `key` må være unik.
